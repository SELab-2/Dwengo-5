import { Router } from "express";
import { authenticate } from "../../../../../controllers/authentication/authenticationMiddleware.ts";
import {
    postSubmission,
    postSubmissionAutoGrade
} from "../../../../../controllers/users/classes/assignments/submissions/submissionsController.ts";

const router = Router({ mergeParams: true });
export default router

router.post("/", authenticate, postSubmission);
router.post("/auto", postSubmissionAutoGrade);