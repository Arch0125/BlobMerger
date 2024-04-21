function hexToString(hex: string, startIndex: number, endIndex: number) {
    hex = hex.startsWith('0x') ? hex.slice(2) : hex;

    hex = hex.substring(startIndex, endIndex + 1);

    var hexPairs = hex.match(/.{1,2}/g);

    var decimalArray = hexPairs.map(function(hexPair) {
        return parseInt(hexPair, 16);
    });

    var str = String.fromCharCode.apply(null, decimalArray);
    return str;
}

var normalString = hexToString("0x203845464439524a20323245636b623558728", 18, 38);
console.log(normalString); 