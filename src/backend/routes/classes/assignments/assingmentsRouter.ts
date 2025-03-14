import {Router} from "express";
import leerlingen_router from "./students/studentsRouter.ts";
import groepen_router from "./groups/groupsRouter.ts";
import conversaties_router from "./conversations/conversationsRouter.ts";
import {
    klasOpdracht,
    klasOpdrachten,
    maakOpdracht,
    verwijderOpdracht
} from "../../../controllers/klassen/opdrachten/opdrachten_controller.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:assignmentId/students", leerlingen_router);
router.use("/:assignmentId/groups", groepen_router);
router.use("/:assignmentId/conversations", conversaties_router);

router.get("/", klasOpdrachten);
router.post("/", maakOpdracht);
router.get("/:assignmentId", klasOpdracht);
router.delete("/:assignmentId", verwijderOpdracht);