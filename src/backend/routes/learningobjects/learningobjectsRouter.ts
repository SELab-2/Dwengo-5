import {Router} from "express";
import {leerobject, leerobjectcontent} from "../../controllers/learningobjects/leerobjecten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/:learningObjectId", leerobject);
router.get("/:learningObjectId/content", leerobjectcontent);
