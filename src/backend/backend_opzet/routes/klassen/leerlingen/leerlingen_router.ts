import {Router} from "express";
import info_router from "./info/info_router.ts";
import {
    klasLeerlingen,
    klasLeerlingToevoegen,
    klasLeerlingVerwijderen
} from "../../../controllers/klassen/leerlingen/leerlingen_controller.ts";

const router = Router({mergeParams: true});
export default router

//router.use("/vragen", vragen_router)
router.use("/info", info_router);

router.get("/", klasLeerlingen);
router.post("/", klasLeerlingToevoegen);
router.delete("/:leerling_id", klasLeerlingVerwijderen);