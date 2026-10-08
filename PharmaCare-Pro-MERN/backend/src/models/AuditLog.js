import mongoose from 'mongoose';
const schema=new mongoose.Schema({action:String,entity:String,entityId:String,user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},details:String},{timestamps:true});
export default mongoose.model('AuditLog',schema);
