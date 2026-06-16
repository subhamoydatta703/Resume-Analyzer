import { Router } from "express";
import { analyzeResume } from "../controllers/analyzeResumeController";
import { getResumeController } from "../controllers/getResumeResultController";

const router = Router();


router.post("/:id", analyzeResume);
router.get("/:id/analyze", getResumeController)

export default router;
