import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const AUTHORIZATION_DENIED = "Authorization denied";
const INVALID_TOKEN = "Token is not valid";
const HTTP_FORBIDDEN = 403;
const HTTP_UNAUTHORIZED = 401;

function verifyJWTToken(req, res, next) {
  const token = req.header("jwtToken");

  if (!token) {
    return res.status(HTTP_FORBIDDEN).json({ msg: AUTHORIZATION_DENIED });
  }

  try {
    const verifiedPayload = jwt.verify(token, jwtSecret);
    req.user = verifiedPayload.user;
    next();
  } catch (err) {
    res.status(HTTP_UNAUTHORIZED).json({ msg: INVALID_TOKEN });
  }
}

export default verifyJWTToken;
