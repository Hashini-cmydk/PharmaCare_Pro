import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import User from '../models/User.js';
const publicUser=u=>({id:u._id,name:u.name,email:u.email,role:u.role});
export async function login(req,res){
 const {email,password}=req.body; const u=await User.findOne({email});
 if(!u) return res.status(401).json({message:'Invalid email or password'});
 if(u.lockedUntil && u.lockedUntil>Date.now()) return res.status(423).json({message:'Account temporarily locked. Try again later.'});
 const ok=await bcrypt.compare(password,u.password);
 if(!ok){u.failedAttempts++; if(u.failedAttempts>=5){u.lockedUntil=new Date(Date.now()+15*60*1000);u.failedAttempts=0;} await u.save();return res.status(401).json({message:'Invalid email or password'});}
 u.failedAttempts=0;u.lockedUntil=null;await u.save();
 const token=jwt.sign({id:u._id,role:u.role,name:u.name,email:u.email},process.env.JWT_SECRET,{expiresIn:'1h'});
 res.json({token,user:publicUser(u)});
}
export async function me(req,res){const u=await User.findById(req.user.id).select('-password');res.json({user:publicUser(u)});}
