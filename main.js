const SHA256 = require('crypto-js/sha256')

class Transaction {
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
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

    createTransaction(transaction){
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

let blockchain = new BlockChain()
blockchain.createTransaction(new Transaction('address1','address2',100))
blockchain.createTransaction(new Transaction('address2','address1',50))

console.log("starting the mining...")
blockchain.minePendingTransactions('satoshi address')
console.log(`Balance of satoshi address is ${blockchain.getBalanceOfAddress('satoshi address')}`)
blockchain.minePendingTransactions('satoshi address')
console.log(`Balance of satoshi address is ${blockchain.getBalanceOfAddress('satoshi address')}`)