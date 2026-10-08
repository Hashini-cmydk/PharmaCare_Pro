import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {connectDB} from './config/db.js';
import User from './models/User.js';
import Supplier from './models/Supplier.js';
import Medicine from './models/Medicine.js';
import Sale from './models/Sale.js';
import StockMovement from './models/StockMovement.js';
import AuditLog from './models/AuditLog.js';

await connectDB();
await Promise.all([
  User.deleteMany({}),
  Supplier.deleteMany({}),
  Medicine.deleteMany({}),
  Sale.deleteMany({}),
  StockMovement.deleteMany({}),
  AuditLog.deleteMany({})
]);

const password=await bcrypt.hash('Password123',12);
const users=await User.insertMany([
  {name:'Mr. Supun Gamage',email:'owner@pharmacarepro.com',password,role:'OWNER'},
  {name:'Front Counter Cashier',email:'cashier@pharmacarepro.com',password,role:'CASHIER'},
  {name:'System Administrator',email:'admin@pharmacarepro.com',password,role:'ADMIN'}
]);
const suppliers=await Supplier.insertMany([
  {name:'Ceylon Pharma Suppliers',contactNumber:'0112345678',email:'sales@ceylonpharma.example',address:'Colombo'},
  {name:'HealthLine Distributors',contactNumber:'0771234567',email:'info@healthline.example',address:'Kalutara'}
]);
const medicines=await Medicine.insertMany([
  {name:'Paracetamol 500mg',category:'Analgesic',batchNumber:'PCM-2601',quantity:120,unitPrice:12.5,expiryDate:new Date('2027-08-30'),reorderLevel:20,supplier:suppliers[0]._id},
  {name:'Amoxicillin 500mg',category:'Antibiotic',batchNumber:'AMX-2602',quantity:35,unitPrice:45,expiryDate:new Date('2027-03-15'),reorderLevel:15,supplier:suppliers[0]._id},
  {name:'Cetirizine 10mg',category:'Antihistamine',batchNumber:'CTZ-2511',quantity:8,unitPrice:18,expiryDate:new Date('2026-11-20'),reorderLevel:10,supplier:suppliers[1]._id},
  {name:'Omeprazole 20mg',category:'Gastro',batchNumber:'OMP-2604',quantity:60,unitPrice:30,expiryDate:new Date('2028-01-10'),reorderLevel:12,supplier:suppliers[1]._id}
]);

const cashier=users.find(user=>user.role==='CASHIER');
const now=new Date();
const yesterday=new Date(now);
yesterday.setDate(yesterday.getDate()-1);
const sales=[
  {invoiceNumber:'INV-DEMO-1001',items:[{medicine:medicines[0]._id,name:medicines[0].name,quantity:2,unitPrice:12.5,total:25},{medicine:medicines[2]._id,name:medicines[2].name,quantity:1,unitPrice:18,total:18}],subtotal:43,total:43,paymentMethod:'CASH',cashier:cashier._id,customerName:'Walk-in Customer',createdAt:now,updatedAt:now},
  {invoiceNumber:'INV-DEMO-1002',items:[{medicine:medicines[1]._id,name:medicines[1].name,quantity:1,unitPrice:45,total:45},{medicine:medicines[3]._id,name:medicines[3].name,quantity:2,unitPrice:30,total:60}],subtotal:105,total:105,paymentMethod:'CARD',cashier:cashier._id,customerName:'Nadeesha Perera',createdAt:now,updatedAt:now},
  {invoiceNumber:'INV-DEMO-0999',items:[{medicine:medicines[0]._id,name:medicines[0].name,quantity:3,unitPrice:12.5,total:37.5}],subtotal:37.5,total:37.5,paymentMethod:'CASH',cashier:cashier._id,customerName:'Walk-in Customer',createdAt:yesterday,updatedAt:yesterday}
];
await Sale.insertMany(sales);
await StockMovement.insertMany([
  {medicine:medicines[0]._id,type:'IN',quantity:125,reference:'Initial demo stock',user:users[0]._id},
  {medicine:medicines[1]._id,type:'IN',quantity:36,reference:'Initial demo stock',user:users[0]._id},
  {medicine:medicines[2]._id,type:'IN',quantity:9,reference:'Initial demo stock',user:users[0]._id},
  {medicine:medicines[3]._id,type:'IN',quantity:62,reference:'Initial demo stock',user:users[0]._id}
]);
console.log('Seed complete');
process.exit(0);
