import {Router} from "express";
import {
    klasLeerkrachten,
    klasVerwijderLeerkracht,
    voegLeerkrachtToe
} from "../../../controllers/klassen/leerkrachten/leerkrachten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", klasLeerkrachten);
router.post("/", voegLeerkrachtToe);
router.delete("/:leerkracht_id", klasVerwijderLeerkracht);