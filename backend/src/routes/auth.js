import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const SECRET_KEY = "your_very_secret_key";

// Dummy user for demo
const USER = { username: "admin", password: "admin" };

router.use(cors());
router.use(bodyParser.json());

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get("/protected", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, SECRET_KEY);
    res.json({ message: "This is protected data", user });
  } catch {
    res.sendStatus(403);
  }
});

export default router;
