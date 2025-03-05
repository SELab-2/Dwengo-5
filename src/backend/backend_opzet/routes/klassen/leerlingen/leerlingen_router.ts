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

function ignoreReturn<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
        fn(...args);
    };
}

router.delete("/:leerling_id", ignoreReturn(klasLeerlingVerwijderen));