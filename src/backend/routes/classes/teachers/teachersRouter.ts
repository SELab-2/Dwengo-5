import {Router} from "express";
import {
    klasLeerkrachten,
    klasVerwijderLeerkracht,
    voegLeerkrachtToe
} from "../../../controllers/classes/teachers/teachersController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", klasLeerkrachten);
router.post("/", voegLeerkrachtToe);
router.delete("/:teacherstudentId", klasVerwijderLeerkracht);