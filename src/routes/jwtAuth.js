import { Router } from "express";
import { genSalt, hash, compare } from "bcrypt";
import pool from "../db.js";
import {
  validateRegistrationData,
  validateLoginData,
} from "../middleware/validate.js";
import jwtGenerator from "../utils/jwtGenerator.js";
import authorize from "../middleware/authorize.js";

const router = Router();

router.post("/register", validateRegistrationData, async (req, res) => {
  const { email, name, password, currency } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401);
    }

    const salt = await genSalt(10);
    const bcryptPassword = await hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_currency) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, currency]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

router.post("/login", validateLoginData, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401);
    }

    const validPassword = await compare(password, user.rows[0].user_password);
    if (!validPassword) {
      return res.status(401);
    }

    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

export default router;
