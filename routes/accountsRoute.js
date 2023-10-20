import Express from "express";
import {
    getAccount,
    getAccountById,
    createAccount,
} from "../controllers/accountsController.js";

const router = Express.Router();

router.post("/createAccount", createAccount);
router.get("/account", getAccount);
router.get("/account/:accountId", getAccountById);

export default router;