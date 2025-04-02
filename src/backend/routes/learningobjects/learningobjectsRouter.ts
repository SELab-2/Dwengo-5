import {Router} from "express";
import {
    getLearningObject,
    getLearningobjectContent,
    getLearningobjectMetadata
} from "../../controllers/learningobjects/learningobjectsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/:learningObjectId", getLearningObject);
router.get("/:learningObjectId/content", getLearningobjectContent);
router.get("/:learningObjectId/metadata", getLearningobjectMetadata);