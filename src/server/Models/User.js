const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const documentSchema = new mongoose.Schema({
    Document_id: {
      type: String,
      required: true,
    },
    Document_Name: {
      type: String,
      required: true,
    },
    Document_Owner: {
      type: String,
      required: true,
    },
    Document_Creator: {
      type: String,
      required: true,
    },
    Document_Issuer: {
      type: String,
      required: true,
    },
    Document_Expiry: {
      type: Date,
      required: true,
    },
    Document_Type: {
      type: String,
      required: true,
    },
    Document_Renewal_Interval: {
      type: Number,
      required: true,
    },
    Document_Content: {
      type: String,
    },
    Document_Access_Keys: {
      type:[String],
      required: true,
    },
    Auto_Renewal: {
      type: String,
      required: true,
    },
    Template_Reference: {
        type: String,
        
    },
  });

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    emiratesID:{
        type: String,
        required:true,
        unique:true,
    },
    phoneNumber:{
        type: String,
        required:true,
        unique:true,

    },
    metaID:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,

    },
    profileImage: {
        type: String,
    },
    dob:{
        type:String,
        required:true
    },
    fingerprintData: {
        type: String, // Adjust the type based on the format of your fingerprint data
      },
    documents: [documentSchema],
    studentID:{
        type: String,
    },
    


});
const templateSchema = new mongoose.Schema({
    template_id: {
        type: String, // Change the type to String
        required: true,
    },
    template_name: {
        type: String,
        required: true,
    },
    doc_used_for: {
        type: String,
        required: true,
    },
    template_image: {
        type: String,
       
    },
  });
  const organizationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    Doc: [
      {
        Document_id: {
          type: String,
          required: true,
        },
        Document_Owner: {
          type: String,
          required: true,
        },
        Document_Key: {
          type: String,
          required: true,
        },
      },
    ],
  });

userSchema.pre('save',async function (next){
    const user = this;
    console.log("just before saving",user.password);
    if(!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    console.log("just before saving after hashing",user.password) 
    next();
})



mongoose.model("User",userSchema);
mongoose.model("Documents",documentSchema);
mongoose.model("Template",templateSchema);
mongoose.model("Organizations",organizationSchema);





