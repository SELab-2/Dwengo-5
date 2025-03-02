import {Router} from "express";
import vragen_router from "./conversaties/conversaties_router.ts";
import info_router from "./info/info_router.ts";
import {
    klas_leerling_toevoegen,
    klas_leerling_verwijderen,
    klas_leerlingen
} from "../../../controllers/klassen/leerlingen/leerlingen_controller.ts";

const router = Router({mergeParams: true})
export default router

router.use(vragen_router)
router.use(info_router)

router.get("/", klas_leerlingen);
router.post("/", klas_leerling_toevoegen);
router.delete("/:leerling_id", klas_leerling_verwijderen);