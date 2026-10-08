import {Router} from 'express'; import {login,me} from '../controllers/auth.js'; import {auth} from '../middleware/auth.js';
const r=Router();r.post('/login',login);r.get('/me',auth,me);export default r;
