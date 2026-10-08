import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},contactNumber:String,email:String,address:String,active:{type:Boolean,default:true}},{timestamps:true});
export default mongoose.model('Supplier',schema);
