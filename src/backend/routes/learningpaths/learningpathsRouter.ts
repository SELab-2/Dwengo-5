import {Router} from "express";
import {
    getLearningpath,
    getLearningpathContent,
    getLearningpaths,
    postLearningpath,
    postLearningpathContent
} from "../../controllers/learningpaths/learningpathsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getLearningpaths);
router.get("/:learningpathId", getLearningpath);
router.get("/:learningpathId/content", getLearningpathContent);
router.get("/:learningpathId/content", postLearningpathContent);
router.post("/", postLearningpath);
