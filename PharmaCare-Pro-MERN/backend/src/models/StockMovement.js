import mongoose from 'mongoose';
const schema=new mongoose.Schema({medicine:{type:mongoose.Schema.Types.ObjectId,ref:'Medicine'},type:{type:String,enum:['IN','OUT','ADJUSTMENT']},quantity:Number,reference:String,user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true});
export default mongoose.model('StockMovement',schema);
