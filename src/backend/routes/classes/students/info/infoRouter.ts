import { Router } from "express";
import { student_info } from "../../../../controllers/classes/students/info/infoController.ts";

const router = Router({ mergeParams: true });
export default router

router.get("/", student_info);