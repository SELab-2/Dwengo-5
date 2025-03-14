import {Router} from "express";
import {
    opdracht_leerlingen,
    opdracht_verwijder_leerling,
    opdracht_voeg_leerling_toe
} from "../../../../controllers/classes/assignments/students/studentsController.ts";

const router = Router({mergeParams: true});
export default router

router.get("/", opdracht_leerlingen);
router.post("/", opdracht_voeg_leerling_toe);
router.delete("/:studentId", opdracht_verwijder_leerling);