import {Router} from "express";
import {
    getLearningpath,
    getLearningpathContent,
    getLearningpaths,
    postLearningpath
} from "../../controllers/learningpaths/learningpathsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", getLearningpaths);
router.get("/:learningpathId", getLearningpath);
router.get("/:learningpathId/content", getLearningpathContent);
router.post("/", postLearningpath);
