import {Request, Response, Router} from "express";
import crypto from 'crypto';
import jwt from "jsonwebtoken";

// deze route is een simpel voorbeeld voor authenticatie en gebruikt daarom geen aparte controllerfile

const router = Router({mergeParams: true});
export default router;

const secret = "our_jwt_secret"; // TODO: echt secret maken

export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    //   const user = await prisma.user.findUnique({
    //     where: { username },
    //   });

    // TODO: echt prisma gebruiken instead of
    // MOCK user object:
    const user = {
        id: 1,
        username: "test",
        password: "$2b$10$X3gYX6WwZ6k8Q5Kw1yJcUuqz4oF6Z9z9Tm2z8b7lF4Z6m5L4N5I7m",
    };

    if (!user) {
        res.status(400).send("User not found.");
        return;
    }

    const isValid = comparePassword(password, user.password);

    if (!isValid) {
        res.status(400).send("Incorrect password.");
        return;
    }

    const token = generateToken(user.id.toString());
    res.json({token});
};

export const signup = async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const hashedPassword = hashPassword(password);
    try {
        // const user = await prisma.user.create({
        // data: { username, password: hashedPassword },
        // });
        // TODO: echt prisma gebruiken
        res.send("User registered successfully.");
    } catch (error: any) {
        // TODO: stricter type possible?
        if (error.code === "P2002" && error.meta?.target?.includes("username")) {
            res.status(400).send("Username already taken.");
        } else {
            res.status(500).send("An unexpected error occurred.");
        }
    }
};

export const me = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    // const user = await prisma.user.findUnique({
    //   where: { id: parseInt(userId) },
    // });
    // TODO: echt prisma gebruiken
    // MOCK user object:
    const user = {
        id: 1,
        username: "test",
    };
    if (!user) {
        res.status(404).send("User not found.");
        return;
    }
    res.json({username: user.username});
};

router.post("/login", login);
router.post("/signup", signup); //todo, dit gebeurt automatisch bij post op leerling of leerkracht
router.get("/me", me); //todo niet nodig

const hashPassword = (password: string) => {
    return crypto.createHash("sha256").update(password).digest("hex");
};

const comparePassword = (password: string, hash: string) => {
    //   return await bcrypt.compare(password, hash);
    return crypto.createHash("sha256").update(password).digest("hex") === hash; // TODO: echt hash-vergelijken
};

const generateToken = (userId: string) => {
    return jwt.sign({userId}, secret, {expiresIn: "1h"}); // TODO: decide on expiration time
};
