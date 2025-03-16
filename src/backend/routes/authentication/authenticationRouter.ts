import {Request, Response, Router} from "express";

import {
    loginLeerling,
    registerLeerling,
} from "../../controllers/authentication/studentAuthenticationController.ts";
import {
    loginTeacher,
    registerTeacher,
} from "../../controllers/authentication/teacherAuthenticationController.ts";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
    const usertype = req.query.usertype;
    if (usertype !== "teacher" && usertype !== "student") {
        // TODO: deze validatie abstraheren naar de validation.js? (algemeen genoeg daarvoor?)
        res.status(400).json({error: "Invalid usertype"});
        return;
    }
    if (usertype === "teacher") await loginTeacher(req, res);
    else await loginLeerling(req, res);
});

router.post("/register", (req: Request, res: Response) => {
    const usertype = req.query.usertype;
    if (usertype !== "teacher" && usertype !== "student") {
        res.status(400).json({error: "Invalid usertype"});
        return;
    }
    if (usertype === "teacher") {
        registerTeacher(req, res);
    } else {
        registerLeerling(req, res);
    }
});

function testGebruikerstype(gegevenType: string): boolean {
    // TODO: denk hierover
    return gegevenType === "teacher" || gegevenType === "student";
    //   res.status(400).json({ error: "Invalid usertype" });
}

export default router;
