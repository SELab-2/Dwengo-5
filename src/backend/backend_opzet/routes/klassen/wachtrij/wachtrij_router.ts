import {Router} from "express";
import {
    laat_leerling_toe,
    stop_in_wachtrij,
    verwijder_uit_wachtrij,
    wachtrij
} from "../../../controllers/klassen/wachtrij/wachtrij_controller.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", wachtrij);
router.post("/", stop_in_wachtrij);
router.delete("/:leerling_id", verwijder_uit_wachtrij);
router.patch("/:leerling_id", laat_leerling_toe);