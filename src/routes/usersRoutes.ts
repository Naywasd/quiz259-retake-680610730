import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { users } from "../db/db.js";

dotenv.config();

const router = Router();

// POST /api/vXXX/login
router.post("/login", (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username or password is incorrect",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "this_is_my_secret";

    const token = jwt.sign(
      {
        username: user.username,
        userId: user.userId,
      },
      jwtSecret,
      {
        expiresIn: "10m",
      }
    );

    if (!user.tokens) {
      user.tokens = [];
    }

    user.tokens.push(token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});



export default router;