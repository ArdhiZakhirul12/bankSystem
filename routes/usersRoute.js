import Express from "express";
import {
  getUser,
  getUserById,
  registerUser,
  deleteUser,
  updateUser,
  loginUser,
  getProfil
} from "../controllers/usersController.js";

import {checkToken} from "../middlewares/checkToken.js"
const router = Express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/users", getUser);
router.get("/users/:userId", getUserById);
router.put("/updateUsers/:userId", updateUser);
router.delete("/delUsers/:userId", deleteUser);

router.get('/auth/authenticate', checkToken, getProfil);

export default router;
