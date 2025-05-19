import {Router} from "express";
import {authenticate} from "../../../../../controllers/authentication/authenticationMiddleware.ts";
import {
    postSubmission,
    getSubmissions,
    gradeSubmission
} from "../../../../../controllers/users/classes/assignments/groups/submissions/submissionsController.ts";

const router = Router({mergeParams: true});
export default router

router.post("/", authenticate, postSubmission);