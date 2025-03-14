import {Router} from "express";
import leerlingen_router from "./students/studentsRouter.ts";
import conversaties_router from "./conversations/conversationsRouter.ts";
import {
    opdrachtGroepen,
    opdrachtMaakGroep,
    opdrachtVerwijderGroep
} from "../../../../controllers/klassen/opdrachten/groepen/groepen_controller.ts";


const router = Router({mergeParams: true});
export default router

router.use("/:groupId/students", leerlingen_router);
router.use("/:groupId/conversations", conversaties_router);

router.get("/", opdrachtGroepen);
router.post("/", opdrachtMaakGroep);
router.delete("/:groupId", opdrachtVerwijderGroep);