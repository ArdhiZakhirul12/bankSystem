import Express from "express";
import {
    createTransaction,
    getTransaction,
    getTransactionById,
} from "../controllers/transactionsController.js";

const router = Express.Router();

router.post("/createTransactions", createTransaction);
router.get("/transactions", getTransaction);
router.get("/transactions/:transaction", getTransactionById);


export default router;