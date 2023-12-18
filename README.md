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

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/3d0a599f-1645-4b2e-8475-8b5b4c4ac91a)

You will see this android emulator. 


Now in the main terminal, please write these commands

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/9ed3943e-c0bc-43de-ac51-6fb3a5d5e38c)

After a few min, you will see these lines 

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/1c3c54f7-0296-47e2-a47b-1b5ee11a0753)

Press a to open inside android. This will open inside the android studio. 

It will install expo go inside the virtual device manager 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/fc613c02-7704-4d96-9531-16922ef12cc5)

and it will open the frontend of the application
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/ceea0e81-ddc7-4fe4-a66d-7aff898df314)

Now we have to add a fingerprint to this device to show the working of the biometrics. To do this,
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/822d1917-e18d-411d-8b45-248a89642887)
Click on the home button.

Pull the screen up to go to the applications page. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/b35e4a9c-a7dd-41ba-b71f-f22871abb548)
Click on settings. 

Search for Security and click on app security. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/cbd06d57-6ef6-46da-aef6-528852492f35)

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/aadcf417-8f99-403b-b0eb-2a4789c142c6)

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/3f27443c-ebc3-4faa-ad21-0885ee53606e)

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/88d79e3a-db52-45b2-a668-82e530464cd9)

Click on done. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/0d0d0acf-47dc-42dc-9846-9232504bc8d0)

Click on Pixel Imprint to add the fingerprint to the device. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/eb7e2f94-583d-403c-8f64-ed42538c6a3c)

You will be taken to this page to add ypur fingerprint. Click on the 3 dots on the controls. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/f737a38c-b8f6-462e-af9f-e7a2b47b0187)

Click on fingerprint.
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/ffe26cdb-0f1e-4973-8fa7-b27f6bff4f12)

Click on the touch sensor button. this will add the fingerprint 1 data to the device. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/7e687e27-3bbc-4454-b0e7-9044fda0a94b)

it will look like this. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/20d241db-3183-4e7e-8daa-ca4577f228b7)

Click on that button until it says the confirmation. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/efe11acb-2995-4a96-94b4-6066653aa77b)

You will see something like this
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/04807be5-d527-4b60-bc82-28171e899348)

Now go back to the codebase and press a on the terminal to open the application on expo go
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/732d8966-0c47-4484-9edd-aaa624ad5e2e)

After clicking login, you will have to press signup as there is no user at the moment in the system. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/beb09a3b-4d9f-4fd5-ad50-79482ba9c16c)

You will have to fill in the details here. There are error cases such as the password not matching or the user already existing or all the fields arent full. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/f47ce0c7-ab1e-42a6-84b5-744902d05c6d)

This is how it will look like after being filled. For the meta mask wallet ID, please use the accounts provided in ganache. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/eda892e7-4849-417e-8e0d-9e2f2515ffbd)

These are the 2 accounts, you can use any of them. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/f4286e38-3613-4910-b039-48b81ab8022b)

After submitting, you will be taken to the biometrics page where the user has to input their biometrics that will be stored in the blockchain eventually. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/6a69a90d-dddf-409e-8fac-50b5db974350)

Once you press on the scan biometrics button, you can press the touch sensor from the extended controls. this will act as if the user is providing their fingerprints. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/acc6a367-8e52-4d38-873c-8a0a03d11e33)

After this, press the studentID button to move to the next page. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/eb75f043-c1a6-465f-bede-1881c02c4289)

As you can see the TX count on the 2nd account has increased by 1 indicating that there has been an addition to the blockchain
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/ca6d9f35-7673-431e-ab96-b8f986b54c9b)
The TX count is at 14 right now as we have only 2 accounts to test our blockchain with so the biometrics kept adding onto these accounts. In the later stages, the accounts will increase. 

Submit the student ID and you will get an alert for the confirmation. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/d2a1d64c-d6a3-4760-ab46-b04630717a34)

This indicates that the data has been fetched from the organisation and the student has been successfully registered in the system.Now press on go to login button to login to the application. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/8b9d80cb-a72e-4524-96af-0f578a69222f)

Click on national ID to login with. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/614a63d1-a15a-48a8-9ee4-47a88f5b0313)

Enter the ID and password you had provided with during sign up. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/69a5cf0a-83dc-4770-ac97-3b91e8a731df)

Click on profile. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/d7634725-18f0-40b7-94f8-c74cd4e978f8)

Click on view documents. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/b3bd11f7-4b35-435a-8a85-2153536fc349)

This will show all the documents that the user has in their account. For this user, they have only 1 document. 
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/29988970-3823-4508-addc-7a3f8ad6997c)

Scan the biometrics to get access to the document. Press the touch sensor in the extended controls to give the fingerprint. 

![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/13ef76a7-03d7-4935-a9b5-ce5f11af3803)

After authenticaion, the template for the document will look like this
![image](https://github.com/IbrahimSiddiqui007/DigiPass/assets/80529354/184e4706-6f65-48d1-b2b0-aa96b5af52e9)



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
