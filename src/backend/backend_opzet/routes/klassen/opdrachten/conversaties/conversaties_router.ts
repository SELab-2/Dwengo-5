import {Router} from "express";
import {opdrachtConversaties} from "../../../../controllers/klassen/opdrachten/conversaties/opdrachten_controller.ts";

const router = Router({mergeParams: true})
export default router

router.get("/", opdrachtConversaties);