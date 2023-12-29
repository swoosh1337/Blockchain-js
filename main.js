const {BlockChain,Transaction} = require('./blockchain.js')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')


const myKey = ec.keyFromPrivate('b4208eb916e9a52e2a7dddef192ae7d0834f7432da39df0dda99fda148b61997')
const myWalletAddress = myKey.getPublic('hex')


let blockchain = new BlockChain()


const newTransaction = new Transaction(myWalletAddress,'public key',10)
newTransaction.signTransaction(myKey)
blockchain.addTransaction(newTransaction)

blockchain.minePendingTransactions(myWalletAddress)
console.log(`Balance of myWallet is ${blockchain.getBalanceOfAddress(myWalletAddress)}`)
