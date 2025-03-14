import {Router} from "express";
import {
    groepLeerlingen,
    groepVerwijderLeerling,
    groepVoegLeerlingToe
} from "../../../../../controllers/classes/assignments/groups/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", groepLeerlingen);
router.post("/", groepVoegLeerlingToe);
router.delete("/:studentId", groepVerwijderLeerling);
