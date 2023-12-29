const EC = require('elliptic').ec
const ec = new EC('secp256k1')

var key = ec.genKeyPair();
const pubKey = key.getPublic('hex')
const privKey = key.getPrivate('hex')

console.log(pubKey)
console.log(privKey)

