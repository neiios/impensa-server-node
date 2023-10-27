import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

function jwtGenerator(user_id) {
  const payload = {
    user: {
      id: user_id,
    },
  };

  return jsonwebtoken.sign(payload, jwtSecret, { expiresIn: "1h" });
}

export default jwtGenerator;
