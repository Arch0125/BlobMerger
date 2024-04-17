import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ethers } from "ethers";
import { stringToHex } from "viem";
import { blobSubmit } from "./helpers/blobSubmit";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let currentBatch = [];
let nextId = 1; // Initial ID for the first submission
let allSubmissions = [];

function createBlob(blobBatch) {
  let tempBlobBatch = blobBatch;
  let blobData = "0x";
  let blobSize = 0;
  let submissions = [];
  let startPosition = 2; // Start after "0x"

  for (let i = 0; i < tempBlobBatch.length; i++) {
    let blobItem = tempBlobBatch[i];
    let hexData = stringToHex(blobItem.blobData);
    let concatBlobData = ethers.concat([blobData, hexData]);
    let newDataLength = ethers.dataLength(concatBlobData);

    if (newDataLength > 131072) {
      // Size in bytes (128 KB)
      break;
    }

    let endPosition = startPosition + ethers.dataLength(hexData) * 2 - 1; // Correct end position calculation
    submissions.push({
      id: blobItem.id,
      senderAddr: blobItem.senderAddr,
      startByte: startPosition,
      endByte: endPosition,
      bytesUsed: ethers.dataLength(hexData),
      status: "BATCHED",
    });

    blobData = concatBlobData;
    blobSize = i + 1;
    startPosition = endPosition + 1; // Update start position for the next loop iteration
  }

  console.log(submissions);

  allSubmissions = allSubmissions.concat(submissions); // Correctly concatenate to allSubmissions

  tempBlobBatch = tempBlobBatch.slice(blobSize); // Update the remaining batch
  return { hexBlobData: blobData, tempBlobBatch, submissions };
}

async function sortAndSubmitBatch() {
  console.log("Building Batch");
  const batchSize = currentBatch.length;
  let blobBatch = currentBatch.slice(0, batchSize);
  console.log("Batch Details :");
  console.log("Batch Size :", blobBatch.length);
  currentBatch = currentBatch.slice(batchSize);
  const { hexBlobData, tempBlobBatch, submissions } = createBlob(blobBatch);
  currentBatch = tempBlobBatch.concat(currentBatch);
  if (ethers.dataLength(hexBlobData) != 0) {
    console.log("Submitting blob data :", hexBlobData);
    const hash = await blobSubmit(hexBlobData);
    console.log("Blob submitted with transaction hash :", hash);
  }
  // You might want to handle or store submissions results here
}

app.post("/submitBlobData", (req, res) => {
  const { senderAddr, blobData } = req.body;
  if (!senderAddr || !blobData) {
    return res.status(400).send("Missing sender address or blob data.");
  }
  currentBatch.push({ id: nextId++, senderAddr, blobData, status: "PENDING" });
  res.status(200).send(`Blob data added successfully with ID ${nextId - 1}.`);
});

app.get("/getAllSubmissions", (req, res) => {
  res.status(200).send(allSubmissions);
});

app.listen(3000, () => {
  console.log("Blob merger listening on port 3000");
});

setInterval(sortAndSubmitBatch, 5000);
