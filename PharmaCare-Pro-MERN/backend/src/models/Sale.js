import mongoose from 'mongoose';
const itemSchema=new mongoose.Schema({medicine:{type:mongoose.Schema.Types.ObjectId,ref:'Medicine'},name:String,quantity:{type:Number,min:1},unitPrice:Number,total:Number},{_id:false});
const schema=new mongoose.Schema({invoiceNumber:{type:String,unique:true},items:[itemSchema],subtotal:Number,total:Number,paymentMethod:{type:String,enum:['CASH','CARD','OTHER'],default:'CASH'},cashier:{type:mongoose.Schema.Types.ObjectId,ref:'User'},customerName:{type:String,default:'Walk-in Customer'}},{timestamps:true});
export default mongoose.model('Sale',schema);
