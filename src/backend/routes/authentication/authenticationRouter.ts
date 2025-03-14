import {Request, Response, Router} from "express";

import {
    aanmeldenLeerling,
    registrerenLeerling,
} from "../../controllers/authentication/studentAuthenticationController.ts";
import {
    aanmeldenLeerkracht,
    registrerenLeerkracht,
} from "../../controllers/authentication/teacherAuthenticationController.ts";

const router = Router();

router.post("/aanmelden", (req: Request, res: Response) => {
    const gebruikerstype = req.query.gebruikerstype;
    if (gebruikerstype !== "leerkracht" && gebruikerstype !== "leerling") {
        // TODO: deze validatie abstraheren naar de validation.js? (algemeen genoeg daarvoor?)
        res.status(400).json({error: "Invalid gebruikerstype"});
        return;
    }
    if (gebruikerstype === "leerkracht") {
        aanmeldenLeerkracht(req, res);
    } else {
        aanmeldenLeerling(req, res);
    }
});

router.post("/registreren", (req: Request, res: Response) => {
    const gebruikerstype = req.query.gebruikerstype;
    if (gebruikerstype !== "leerkracht" && gebruikerstype !== "leerling") {
        res.status(400).json({error: "Invalid gebruikerstype"});
        return;
    }
    if (gebruikerstype === "leerkracht") {
        registrerenLeerkracht(req, res);
    } else {
        registrerenLeerling(req, res);
    }
});

function testGebruikerstype(gegevenType: string): boolean {
    // TODO: denk hierover
    return gegevenType === "leerkracht" || gegevenType === "leerling";
    //   res.status(400).json({ error: "Invalid gebruikerstype" });
}

export default router;
