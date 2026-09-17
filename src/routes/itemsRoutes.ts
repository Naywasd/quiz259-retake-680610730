import { Router, type Response } from "express";

import { items, users } from "../db/db.js";

import authenticateToken from "../middlewares/authenMiddleware.js";

import type { CustomRequest } from "../libs/types.js";

const router = Router();

// GET /api/vXXX/basket/:userId
router.get(
  "/:userId",
  authenticateToken,
  (req: CustomRequest, res: Response) => {
    const userId = req.params.userId;

    if (req.user?.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this basket",
      });
    }

    const user = users.find(
      (user) => user.userId === userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const myItems = items.filter(
      (item) => item.userId === userId
    );

    return res.status(200).json({
      success: true,
      data: myItems,
    });
  }
);

export default router;