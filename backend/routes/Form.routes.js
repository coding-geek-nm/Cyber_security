import express from 'express';
const router=express.Router();

import FormController from '../controllers/form.controllers.js';

router.post('/submit', FormController.createForm);
export default router;