import {Router} from "express";
import {authenticate} from "../../../../../../controllers/authentication/authenticationMiddleware.ts";
import {
    postSubmission,
    getSubmissions,
    gradeSubmission,
    getSubmission
} from "../../../../../../controllers/users/classes/assignments/submissions/submissionsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getSubmissions);
router.get("/:submissionId", getSubmission);
router.patch("/:submissionId", gradeSubmission);