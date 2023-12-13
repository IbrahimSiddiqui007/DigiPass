const express = require("express");
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");


require('./Models/User');



const requiredToken = require('./Middleware/Auth');

mongoose.connect(
    "mongodb+srv://samir:1234@cluster0.kkgxfky.mongodb.net/?retryWrites=true&w=majority"
    //"mongodb://100.74.18.107:27017/1234",
).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log("error connecting to mongo", err)
})
const authRoutes = require('./Routes/auth_routes');

const getToBlockchain = require('./blockchain/Get');

app.use(bodyParser.json());
app.use(authRoutes);

app.get('/',requiredToken,(req,res)=>{
    console.log(req.user);
    res.send(req.user);
})
app.use('/uploads', express.static('uploads'));



app.listen(port,()=>{
    console.log(`server running on port ${port}` );
})

const fetchData = async () => {
    try {
        const result = await getToBlockchain();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
};

fetchData();