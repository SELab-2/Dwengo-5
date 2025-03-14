import {Router} from "express";
import {leerlingConversaties,} from "../../../../controllers/classes/students/conversations/conversationsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerlingConversaties);