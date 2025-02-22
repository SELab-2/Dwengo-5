import { Router } from 'express';
import { helloWorld } from '../controllers/helloWorldController';

const router = Router();

router.get('/', helloWorld);

export default router;