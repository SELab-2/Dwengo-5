import {Router} from "express";

import submissionsRouter from "./submissions/submissionsRouter.ts";

const router = Router({mergeParams: true});
export default router

router.use("/:groupId/submissions", submissionsRouter);