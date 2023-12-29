const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index,timestamp,data,previousHash=''){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.difficulty = 5
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty){
        console.log("mining block...")
        while(this.hash.substring(0,this.difficulty) !== Array(this.difficulty + 1).join("0")){
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log("Block mined: " + this.hash)
    }
}


class BlockChain {
    constructor(){
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock(){
        return new Block(0,'12/29/2023','Genesis Block','0')
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
}

let blockchain = new BlockChain()
blockchain.addBlock(new Block(1,'12/29/2023',{amount:4}))
blockchain.addBlock(new Block(2,'12/29/2023',{amount:10}))
blockchain.addBlock(new Block(3,'12/29/2023',{amount:15}))
blockchain.addBlock(new Block(4,'12/29/2023',{amount:20}))
blockchain.addBlock(new Block(5,'12/29/2023',{amount:20}))

console.log(blockchain)