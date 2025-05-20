import { Router } from "express";
import {
    getSubmissions, gradeSubmission
} from "../../../../../controllers/classes/assignments/groups/submissions/submissionsController.ts";

const router = Router({ mergeParams: true });
export default router

router.get("/", getSubmissions);
router.patch("/:submissionId", gradeSubmission);
