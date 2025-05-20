import { Router } from "express";
import { login, register } from "../../controllers/authentication/authenticationController.ts";

const router = Router();
export default router;

router.post("/login", login);
router.post("/register", register);

