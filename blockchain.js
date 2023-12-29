const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const SHA256 = require('crypto-js/sha256')

class Transaction {
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!')
        }
        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex')
    }

    isValid(){
        if(this.fromAddress === null) return true
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction')
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}

class Block {
    constructor(timestamp,transactions,previousHash=''){
        this.transactions = transactions
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty){
        console.log("mining block...")
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log("Block mined: " + this.hash)
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false
            }
        }
        return true
    }


}


class BlockChain {
    constructor(){
        this.difficulty = 4
        this.chain = [this.createGenesisBlock()]
        this.pendingTransactions = []
        this.reward = 100
    }

    createGenesisBlock(){
        return new Block('12/29/2023','Genesis Block','0')
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if(!currentBlock.hasValidTransactions()){
                return false
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false
            }
        }
        return true
    }

    minePendingTransactions(minerAddress){
        let block = new Block(Date.now(),this.pendingTransactions)
        block.mineBlock(this.difficulty)
        this.chain.push(block)
        this.pendingTransactions = [
            new Transaction(null,minerAddress,this.reward)
        ]
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address')
        }
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain')
        }

        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address){
        let balance = 0
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                }
                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }
        return balance
    }
}

module.exports.BlockChain = BlockChain
module.exports.Transaction = Transaction
