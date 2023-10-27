import { compare, genSalt, hash } from "bcrypt";
import authorize from "../middleware/authorize.js";
import query from "../db.js";
import { Router } from "express";

const router = Router();

router.get("/", authorize, async (req, res) => {
  try {
    const user = await query(
      "SELECT user_name, user_currency, user_email FROM users WHERE user_id = $1",
      [req.user.id]
    );

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

router.post("/expense", authorize, async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    const newExpense = await query(
      "INSERT INTO expenses (user_id, expense_amount, expense_description, expense_category) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.id, amount, description, category]
    );

    res.json(newExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

router.put("/expense", authorize, async (req, res) => {
  try {
    const {
      expense_id,
      expense_amount,
      expense_description,
      expense_category,
    } = req.body;

    const updateExpense = await query(
      "UPDATE expenses SET expense_amount = $1, expense_description=$2, expense_category=$3 WHERE expense_id = $4 AND user_id = $5 RETURNING *",
      [
        expense_amount,
        expense_description,
        expense_category,
        expense_id,
        req.user.id,
      ]
    );

    res.json(`Expense with ID ${expense_id} was updated`);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

router.delete("/expense/:expense_id", authorize, async (req, res) => {
  try {
    const { expense_id } = req.params;
    const deleteExpense = await query(
      "DELETE FROM expenses WHERE expense_id = $1 AND user_id = $2 RETURNING *",
      [expense_id, req.user.id]
    );

    res.json(`Expense ${expense_id} was deleted`);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

router.get("/expenses", authorize, async (req, res) => {
  try {
    const expenses = await query(
      "SELECT * FROM expenses WHERE user_id = $1 ORDER BY expense_date USING <",
      [req.user.id]
    );

    res.json(expenses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

router.get("/user", authorize, async (req, res) => {
  try {
    const userData = await query(
      "SELECT user_name, user_email FROM users WHERE user_id = $1",
      [req.user.id]
    );

    res.json(userData.rows);
  } catch (err) {
    console.error(err.mesage);
    res.status(500);
  }
});

router.put("/user", authorize, async (req, res) => {
  try {
    const { userName, userEmail, userPassword, userNewPassword } = req.body;

    const user = await query("SELECT * FROM users WHERE user_id = $1", [
      req.user.id,
    ]);

    const validPassword = await compare(
      userPassword,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credentials!");
    }

    const salt = await genSalt(10);
    const bcryptPassword = await hash(userNewPassword, salt);

    const updateUser = await query(
      "UPDATE users SET user_name=$1, user_email=$2, user_password=$3 WHERE user_id=$4  RETURNING *",
      [userName, userEmail, bcryptPassword, req.user.id]
    );

    return res.json("User updated succesfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500);
  }
});

export default router;
