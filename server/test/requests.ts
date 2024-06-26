import { ethers } from "ethers";
import axios from "axios";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

async function sendRequests() {
  const wallet = new ethers.Wallet("5b1c32040fad747da544476076de2997bbb06c39353d96a4d72b1db3e60bcc82");
  const randomString = generateString(Math.round(Math.random() * 10));
  const data = randomString;
  console.log({
    senderAddr: wallet.address,
    blobData: data,
  });
  const res = await axios.post("http://localhost:3002/submitBlobData", {
    senderAddr: wallet.address,
    blobData: data,
  });

  console.log("Sending blob :", {
    senderAddr: wallet.address,
    blobData: data,
  });

  console.log(res.data);
}

function main() {
  let limit = 2;
  while (limit > 0) {
    sendRequests();
    limit--;
  }
}

main();
