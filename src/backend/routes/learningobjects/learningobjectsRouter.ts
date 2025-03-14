import {Router} from "express";
import {getLearningObject, getLearningobjectContent} from "../../controllers/learningobjects/learningobjectsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/:learningObjectId", getLearningObject);
router.get("/:learningObjectId/content", getLearningobjectContent);
