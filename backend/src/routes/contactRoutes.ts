import { Router } from 'express';
import * as contactController from '../controllers/contactController';

const router = Router();

// Contact form submission (public endpoint)
router.post('/', contactController.submitContactForm);

export default router;

