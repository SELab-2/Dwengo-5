import {Router} from "express";
import {
    leerlingConversaties,
} from "../../../../controllers/classes/students/conversations/conversationsController.ts";
import {authenticate} from "../../../../controllers/authentication/commonAuthenticationController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", leerlingConversaties);