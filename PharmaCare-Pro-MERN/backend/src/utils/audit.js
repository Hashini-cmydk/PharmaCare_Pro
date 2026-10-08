import AuditLog from '../models/AuditLog.js';
export async function audit(user,action,entity,entityId,details=''){try{await AuditLog.create({user:user?._id||user?.id,action,entity,entityId:String(entityId||''),details});}catch(e){console.error('audit failed',e.message)}}
