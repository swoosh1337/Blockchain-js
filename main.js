const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index,timestamp,data,previousHash=''){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
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
        newBlock.hash = newBlock.calculateHash()
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

console.log(blockchain.isChainValid())

// console.log(JSON.stringify(blockchain, null, 4))