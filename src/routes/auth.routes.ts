import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateToken } from "../libs/validate-token";

const router: Router = Router();

router.post("/signup", authController.signup);

router.post("/signin", authController.signin);

router.get("/profile", validateToken, authController.profile);

export default router;
