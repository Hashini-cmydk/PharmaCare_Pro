import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true},category:{type:String,required:true},batchNumber:{type:String,required:true},quantity:{type:Number,min:0,default:0},unitPrice:{type:Number,min:0,required:true},expiryDate:{type:Date,required:true},reorderLevel:{type:Number,min:0,default:10},supplier:{type:mongoose.Schema.Types.ObjectId,ref:'Supplier'},active:{type:Boolean,default:true}},{timestamps:true});
schema.index({name:'text',batchNumber:'text',category:'text'});
export default mongoose.model('Medicine',schema);
