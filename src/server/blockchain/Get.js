const { Web3 } = require('web3');

const GetBiometrics = async () => {
    try {
         // Connect to Ganache
         const ganacheUrl = 'http://192.168.56.1:7545';
         const web3 = new Web3(ganacheUrl);
 
         // Contract details
         const contractAddress = '0xe5aA48BB3c370c5F491F3B8ad6Fe1449914571a2'; // fetch from blockchain
         const contractABI = [
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "uid",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "Bval",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "location",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "biometricType",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
                }
              ],
              "name": "BiometricStored",
              "type": "event"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "uid",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "Bval",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "location",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "biometricType",
                  "type": "string"
                }
              ],
              "name": "addBD",
              "outputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "getBiometricDataCount",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "index",
                  "type": "uint256"
                }
              ],
              "name": "getBiometricData",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            }
          ]; // fetch from blockchain
         const targetAddress = '0x6c5f1a9C422937776a7c08D44d8A2b26413fDe78'; // fetch from db
 
         const contract = new web3.eth.Contract(contractABI, contractAddress);

         // Fetch data count
         const count = await contract.methods.getBiometricDataCount().call({ from: targetAddress });
 
         // Fetch and return the first matching BVal for the specified biometric type
         for (let i = 0; i < count; i++) {
             const result = await contract.methods.getBiometricData(i).call({ from: targetAddress });
             if (result[0] == "2") {
                console.log( result[1]) 
            }
         }
         
         // Return null if no matching BVal is found after the loop
         return null;
     } catch (error) {
         console.error('Error fetching data from the blockchain:', error);
         throw error; // Rethrow the error
     }
};

module.exports = GetBiometrics;