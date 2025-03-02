import { Router } from "express";
import {
  beantwoord_vraag,
  leerling_conversaties,
  vraag,
  vraag_aanmaken,
  vraag_verwijderen,
} from "../../../../controllers/klassen/leerlingen/conversaties/conversaties_controller.ts";

const router = Router({ mergeParams: true });
export default router;

router.get("/", leerling_conversaties);
