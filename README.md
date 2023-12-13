# DigiPass

## Downloading the files

```bash
git clone https://github.com/IbrahimSiddiqui007/DigiPass.git
```
Go into the folder

```bash
cd DigiPass
```
Install all necessary dependencies

```bash
npm install
```

## Downloading and Running the Blockchain

### Installing Ganache and getting it running

#### Please install Ganache using the following link:
[Ganache install](https://trufflesuite.com/ganache/)

#### After installing ganache, open it and you will see the following:
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/51f08d4e-a719-42e0-8b41-e62236c651c1)


#### In your case however, you will not have a created workspace.

#### Next, click on the "New workspace" button and you will be presented with the following screen:
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/9fc94c70-68a9-4013-bd41-b91d117da727)

#### Next click on server and then click on HOSTNAME.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/7d4cc711-4e86-4c21-9ec8-e4a4c33d06a6)

#### In my case I have 2 ethernet connections and I will select the first one. You may select any of the ethernet connections that are available to you.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/7181b24f-920b-4840-9d71-492df4ebe7c6)

#### If you would Like to add or decrease the number of accounts then you can go to the Accounts & keys sections and adjust the amount of accounts to your liking.

#### At this point you can click on start and you will be presented with the following.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/0aa5eb34-23e1-4224-b04e-04d9dba18cf3)

#### Please do remember that things like account address, rpc server and mnemonic will not be the same on your machine as those are randomy generated by ganache or something that you selected.

### Deploying the contract

#### After getting ganache running go back to the files and run the following command in the terminal

```bash
npm install -g truffle
```

#### After it is finished installing run the following command

```bash
truffle init Blckchain
```
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/678a7433-777b-4508-81a2-3c0f8754a715)

#### After the above command has finish running open the newly created folder in your editor of choice. Mine is visual studio code. These are the files and folders that are created with.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/17248c2d-7794-449a-a19f-d1aad1368cb9)

#### Now within the Truffle-config.js file delete everything and paste the following.

```javascript

module.exports = {
  networks: {
    development: {
      host: "192.168.1.86",
      port: 7545,
      network_id: "*", // Match any network id
    }
  },
  solc: {
    settings: {
      optimizer: {
        enabled: true, // Default: false
        runs: 200      // Default: 200
      },
    }
  }
};

```
#### Change the IP address to one specified by the RPC server in ganache. Your RPC server IP address might be different.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/cb6b4576-3aa5-4b7c-8cbb-92c8cb4d6e49)

#### Now create 4 files. 2 In the contracts folder and 2 in the migrations folder. Keep the names of the files exactly as I have them especially the files in the migration folder.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/97b80594-b087-471b-9433-c67748f988eb)

#### As for the content of the files 
#### Migrations.sol

```solidity
pragma solidity ^0.5.16;

contract Migrations {
  address public owner;
  uint256 public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
```
#### Test.sol

```solidity
pragma solidity ^0.5.16;

contract test {
    struct bio {
        uint uid; // Unified ID
        string Bval; // Biometric value
        string location; // Which location of the type of fingerprint
        string biometricType; // Which fingerprint is it (as a string)
    }

    mapping(address => bio[]) private BioRecords;

    event BiometricStored(address indexed owner, uint uid, string Bval, string location, string biometricType, uint256 timestamp);

    function addBD(uint uid, string memory Bval, string memory location, string memory biometricType) public {
        bio memory record = bio({
            uid: uid,
            Bval: Bval,
            location: location,
            biometricType: biometricType
        });

        BioRecords[msg.sender].push(record);
        emit BiometricStored(msg.sender, uid, Bval, location, biometricType, block.timestamp);
    }

    function getBiometricDataCount() public view returns (uint256) {
        return BioRecords[msg.sender].length;
    }

    function getBiometricData(uint256 index) public view returns (uint, string memory, string memory, string memory) {
        require(index < BioRecords[msg.sender].length, "Index out of bounds");
        bio storage record = BioRecords[msg.sender][index];
        return (record.uid, record.Bval, record.location, record.biometricType);
    }
}
```

#### 1_initial_migration.js

```javascript
const Migrations = artifacts.require("./Migrations.sol");


module.exports = function(deployer) {
  deployer.deploy(Migrations);

};
```

#### 2_deploy_contracts.js

```javascript
const test = artifacts.require("test");


module.exports = function(deployer) {
  deployer.deploy(test);

};
```

#### Now go into the terminal and CD into the folder called blckchain

```bash
cd blckchain

truffle migrate
```

#### Hopefully after running that you will get the following text in the terminal. 

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/a9d6c4ce-f7a9-45d1-bc0c-54023fda90b8)

#### If you open ganache you will see the following under the contracts section
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/87603789/a44a772b-eb62-4967-8aed-9c559a85be65)


## Connecting the blockchain and the database to the application
The Backend (Database and Blockchain):
The server folder runs the backend for the application.
To run the backend you have to update the mongodb server path. We have an existing database and the documents will be added there. 
In the routes folder, the auth_routes file has the code for adding the biometrics to the blockchain. 
In the auth_routes, scroll down to the fingerprint api, here is where the fingerprint data is added to the blockchain.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/7b3b8d2b-abca-41a0-bf50-e1713b9c9043)
Please change the ganache_url to your RPC server. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/9974ad36-57e8-4ce5-95cb-b6d42177c593)
Change the contract address to the contract address of 'test' thats stored in ganache. you can access this contract address by going to the contracts tab inside ganache and clicking on the name of the contract called test. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/82a44fdd-c359-48eb-98a3-0f0da6e95cac)

--
For getting the values from the blockchain, you can go to the Get.js file inside the blockchain folder. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/c1c48ff8-115d-477a-8058-6e1cc22aaf6a)
Change the ganache url to your RPC server.
Change the contract address to the address of the contract named test.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/cfa0484e-322b-4dfb-9a0a-0cf5e0082b44)
Change the value of target address to the meta mask wallet ID. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/457f24e3-8e51-4b20-b918-b4bea310ee8d)
Use one of these accounts.
Please keep this terminal running. we will use a new terminal for the frontend. 

Frontend (Navigation between screens):
Once you run npm start on the root folder, we will connect the frontend and view it on Android Studio. 
You can install android studio for windows or ios. once the installation has happened, 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/4bdfd140-8d52-412e-b4b0-753d32f2c5b2)
Click on More actions> Virtual Device Manager. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/7316d7bf-b46c-4a83-8997-80d2b8513e19)
Create a device. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/ae1f0dae-ca03-4a02-9f54-a36dd282b3a8)
Select the Pixel6a and press next.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/4fc4e2de-ed38-4499-b307-387492c8ba02)
You will see a small download button next to the API34. Download that and move to next
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/90b230f8-a66c-49cc-961d-1e53cdf4bfcc)
Click on finish. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/df028d4d-873f-454b-94c7-8806016fdc8c)
Click on the run button. 

Now in the main terminal, please write these commands
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/9ed3943e-c0bc-43de-ac51-6fb3a5d5e38c)
After a few min, you will see these lines 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/1c3c54f7-0296-47e2-a47b-1b5ee11a0753)
Press a to open inside android. This will open inside the android studio. 

It will install expo go inside the virtual device manager and then it will open the frontend
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/3dea2b99-f100-4a0a-9dda-5807ff1d4dd5)


## Running the application
#### Now create 2 fresh terminal sessions

#### Run the following commmands in both sessions

```bash
CD Digipass
```

#### Now in the first terminal session run the following command

```bash
cd server

npm start
```

#### While doing that run the following commands in the second terminal session

```bash
cd screens

npm start
```
