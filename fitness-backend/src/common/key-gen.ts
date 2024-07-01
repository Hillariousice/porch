import { v4 as uuidv4 } from 'uuid';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function generateUuidToken() {
  const token = uuidv4();
  const hashedToken = await jwt.sign({ token }, process.env.JWT_SECRET);
  return hashedToken;
}
