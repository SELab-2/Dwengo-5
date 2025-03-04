import {Router} from "express";
import {opdrachtConversaties} from "../../../../controllers/klassen/opdrachten/conversaties/conversaties_controller.ts";

const router = Router({mergeParams: true})
export default router

router.get("/", opdrachtConversaties);