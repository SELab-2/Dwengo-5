import { Router } from "express";
import {
    getLearningObject,
    getLearningobjectContent,
    createLearningObject
} from "../../controllers/learningobjects/learningobjectsController.ts";

const router = Router({ mergeParams: true });
export default router;

router.get("/:learningObjectId", getLearningObject);
router.get("/:learningObjectId/content", getLearningobjectContent);
router.post("/", createLearningObject);
