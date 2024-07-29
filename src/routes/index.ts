import { Router } from "express";

const router = Router();

// Example route
router.get("/health", (req, res) => {
  res.send("Server is healthy!");
});

export default router;
