const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Document = mongoose.model("Documents");
const jwt = require('jsonwebtoken');
const requiredToken = require('../Middleware/Auth');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const { Web3 } = require('web3');

function generateRandomFingerprintData() {
    const possibleCharacters = '0123456789ABCDEF';
    const fingerprintLength = 32; // You can adjust the length based on your requirement
  
    let fingerprintData = '';
    for (let i = 0; i < fingerprintLength; i++) {
      const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
      fingerprintData += possibleCharacters.charAt(randomIndex);
    }
  
    return fingerprintData;
  }

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // The folder where your images will be stored
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        cb(null, uuidv4() + extension); // Use UUID to generate a unique filename
    },
});
const upload = multer({ storage: storage });
const addToBlockchain = async (token, fingerprintData) => {
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
          ];// fetch from blockchain
        //const targetAddress = '0x1D9a7e6759Df6cA6f19b4961dE1d6A01548CbF64'; // fetch from db
        //const targetAddress = User.metaID;
        

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken || !decodedToken._id) {
            console.error('Invalid or missing token');
            return;
        }

        // Retrieve the user's metaID from the database using the decoded token
        const userId = decodedToken._id;
        const user = await User.findById(userId);

        if (!user) {
            console.error('User not found');
            return;
        }


        // Use the user's metaID as the targetAddress
        const targetAddress = user.metaID;
        // const user = await mongoose.model('User').findById(targetAddress);
        // if (!user) {
        //     console.error('User not found');
        //     return;
        // }

        // // Use the user's metaID as the targetAddress
        // const targetAddress = user.metaID;
        // Create contract instance
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Example data
        const sampleData = {
            uid: 1,
            Bval: fingerprintData,
            location: 'Left Thumb',
            biometricType: 'FingerPrint',
        }; // fetch from db and generate value

        // Add data to the blockchain
        const gas = await contract.methods.addBD(sampleData.uid, sampleData.Bval, sampleData.location, sampleData.biometricType)
            .estimateGas({ from: targetAddress });

        const receipt = await contract.methods.addBD(sampleData.uid, sampleData.Bval, sampleData.location, sampleData.biometricType)
            .send({ from: targetAddress, gas });

        console.log('Transaction Receipt:', receipt);
    } catch (error) {
        console.error('Error interacting with the blockchain:', error);
    }
};





router.post('/upload', requiredToken, upload.single('profileImage'), async (req, res) => {
    try {
        const { _id } = req.user; // Assuming you have user information in the request
        console.log(req.user);

        if (!_id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the filename to the user profileImage field
        user.profileImage = req.file.filename;
        await user.save();

        res.json({ success: true, message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/signup',(req,res)=>{
    //res.send("this is signup page");

    console.log("send by client" , req.body);

    const { firstName,lastName, emiratesID, phoneNumber,metaID,password, dob}= req.body;
    if(!emiratesID || !password || !firstName||!lastName || !dob || !phoneNumber|| !metaID){
        return res.status(422).send({error:"Please fill all fields"});
    }

    User.findOne({ emiratesID: emiratesID})
        .then(async (savedUser)=>{
                if(savedUser){
                    return res.status(422).send({error:"User already exists"});

                }
                const user = new User({
                    firstName,
                    lastName,
                    emiratesID,
                    phoneNumber,
                    metaID,
                    password,
                    dob
                })
                try{
                    await user.save();
                   // res.send({message: "User saved successfully"});
                    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
                    res.send({token});
                    console.log("token for registering is" ,token)
                }
                catch(err) {
                    console.log("db error", err);
                    return res.status(422).send({error : err.message});
                }
            }
        )
})

router.post('/signin', async (req, res) => {
    const { emiratesID, password } = req.body;
    if (!emiratesID || !password) {
        return res.status(422).json({ error: "Please fill all fields" });
    }

    const savedUser = await User.findOne({ emiratesID: emiratesID });

    if (!savedUser) {
        return res.status(422).json({ error: "User does not exist" });
    }

    try {
        bcrypt.compare(password, savedUser.password, async (err, result) => {
            if (result) {
                console.log("Password matched");
                const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);

                // Retrieve document names associated with the user's _id
                const userDocuments = await Document.find({ Document_Owner: savedUser._id });
                const documentNames = userDocuments.map((document) => document.Document_Name);

                res.json({ token, userfName: savedUser.firstName,userlName:savedUser.lastName, userEmiratesID: savedUser.emiratesID, userphone: savedUser.phoneNumber, documentNames });
                console.log("token for login is ", token);
            } else {
                console.log('Password does not match');
                return res.status(422).json({ error: "Wrong password" });
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/signinphone', async(req,res)=>{
    const {phoneNumber, password} = req.body;
    if(!phoneNumber || !password){
        return res.status(422).json({ error:"Please fill all fields"});

    }
    const savedUser = await User.findOne({phoneNumber:phoneNumber})
    if(!savedUser){
        return res.status(422).json({error:"User does not exist"})
    }
    try{
        bcrypt.compare(password, savedUser.password, (err,result)=>{
            if(result) {
                console.log("Password matched");
                
                const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET);
                res.send({token});
                console.log("token for login is ",token)
            }
            else{
                console.log('Password does not match');
                return res.status(422).json({error:"Wrong password"});
            }
        })
    }
    catch(err){
        console.log(err);
    }
})

router.post('/signinmeta', async(req,res)=>{
    const {metaID, password} = req.body;
    if(!metaID || !password){
        return res.status(422).json({ error:"Please fill all fields"});

    }
    const savedUser = await User.findOne({metaID:metaID})
    if(!savedUser){
        return res.status(422).json({error:"User does not exist"})
    }
    try{
        bcrypt.compare(password, savedUser.password, (err,result)=>{
            if(result) {
                console.log("Password matched");
                
                const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET);
                res.send({token});
                console.log("token for login is ",token)
            }
            else{
                console.log('Password does not match');
                return res.status(422).json({error:"Wrong password"});
            }
        })
    }
    catch(err){
        console.log(err);
    }
})

router.get('/getname', requiredToken, async (req, res) => {
    try {
        // Access user information from the request object
        const userID = req.user._id;

        // Send the user details including the image URL in the response
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract relevant information, including the image URL
        const userDetails = {
            firstName: user.firstName,
            lastName: user.lastName,
            studentNumber: user.studentID,
            barcode: user.phoneNumber,
            imageUrl: user.profileImage ? `/uploads/${user.profileImage}` : null,
        };

        // Send the details as a JSON response
        res.json(userDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


      router.get('/profile-image', requiredToken,async (req, res) => {
        try {
            const { _id } = req.user; // Assuming you have user information in the request
            console.log(req.user);
            
    
            if (!_id) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
    
            const user = await User.findById(_id);
    
            if (!user || !user.profileImage) {
                return res.status(404).json({ error: 'Image not found for the user' });
            }
    
            // Assuming that the images are served from the 'uploads' folder
            const imageUrl = `/uploads/${user.profileImage}`;
            res.json({ imageUrl });
        } catch (error) {
            console.error('Error fetching image URL:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    router.post('/fingerprint', requiredToken, async (req, res) => {
        try {
            // Access user information from the request object
            const userID = req.user._id;
    
            if (!userID) {
                return res.status(400).json({ error: 'Bad Request' });
            }
    
            // Log the token content or any relevant information
            console.log('Token Content:', req.token);
    
            // Find the user and update fingerprint data
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Generate random fingerprint-like data
            const randomFingerprintData = generateRandomFingerprintData();
    
            user.fingerprintData = randomFingerprintData;
            await user.save();
    
            // Connect to Ganache
            const ganacheUrl = 'http://192.168.56.1:7545';
            const web3 = new Web3(ganacheUrl);
    
            // Contract details
            const contractAddress = '0xe5aA48BB3c370c5F491F3B8ad6Fe1449914571a2';
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
              ];
    
            // Use the user's metaID as the targetAddress
            const targetAddress = user.metaID;
    
            // Create contract instance
            const contract = new web3.eth.Contract(contractABI, contractAddress);
    
            // Example data
            const sampleData = {
                uid: 2,
                Bval: randomFingerprintData,
                location: 'Left Thumb',
                biometricType: 'FingerPrint',
            };
    
            // Add data to the blockchain
            const gas = await contract.methods.addBD(sampleData.uid, sampleData.Bval, sampleData.location, sampleData.biometricType)
                .estimateGas({ from: targetAddress });
    
            const receipt = await contract.methods.addBD(sampleData.uid, sampleData.Bval, sampleData.location, sampleData.biometricType)
                .send({ from: targetAddress, gas });
    
            console.log('Transaction Receipt:', receipt);
    
            res.json({ success: true, message: 'Random fingerprint data stored successfully', fingerprintData: randomFingerprintData });
        } catch (error) {
            console.error('Error storing fingerprint data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
      router.post('/updateStudentID', requiredToken, async (req, res) => {
        try {
            // Retrieve user details from the authenticated user (stored in req.user by authMiddleware)
            const userId = req.user.id;
            const { studentID } = req.body;
    
            // Generate unique IDs
            const documentId = `DOC-${uuidv4().slice(0, 8)}`;
            const templateId = `TEMP-${uuidv4().slice(0, 8)}`;
            const documentKey = `KEY-${uuidv4().slice(0, 8)}`;
    
            // Update the user's student ID in the database
            await mongoose.model('User').findByIdAndUpdate(userId, { $set: { studentID } });
    
            // Create a new document entry
            await mongoose.model('Documents').create({
                Document_id: documentId,  // Change to Document_id
                Document_Name: 'Student RFID',
                Document_Owner: userId,
                Document_Creator: 'uowd',
                Document_Issuer: 'uowd',
                Document_Expiry: new Date('2024-12-31'),
                Document_Type: 'id template',
                Document_Renewal_Interval: 10,
                Document_Content: 'fetched',
                Document_Access_Keys: [userId, documentKey],
                Auto_Renewal: 'yes',
                Template_Reference: templateId,  // Change to Template_Reference
            });
    
            // Create a new template entry
            await mongoose.model('Template').create({
                template_id: templateId,  // Change to template_id
                template_name: 'id card',
                doc_used_for: 'academic identity',
                template_image: null,
            });
    
            // Create a new organisation entry
            await mongoose.model('Organizations').create({
                name: 'uowd',
                Doc: [{ Document_id: documentId, Document_Owner: userId, Document_Key: documentKey }],  // Change to Document_id, Document_Owner, Document_Key
            });
    
            // Send a success response
            res.status(200).json({ message: 'Student ID updated successfully' });
        } catch (error) {
            console.error('Error updating student ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        
    });
module.exports = router;