import { Router } from "express";
import authRoutes from "./auth/v1";

const router = Router();

// Example route
router.get("/health", (req, res) => {
  res.send("Server is healthy!");
});

router.use("/v1", authRoutes);

export default router;
