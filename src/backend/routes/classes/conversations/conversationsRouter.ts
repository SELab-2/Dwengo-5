import {Router} from "express";
import {klasConversaties} from "../../../controllers/klassen/conversaties/conversaties_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", klasConversaties);