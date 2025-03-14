import {Router} from "express";
import {getLearningpath, getLearningpathContent, getLearningpaths} from "../../controllers/learningpaths/leerpaden_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getLearningpaths);
router.get("/:learninpathId", getLearningpath);
router.get("/:learninpathId/content", getLearningpathContent);
