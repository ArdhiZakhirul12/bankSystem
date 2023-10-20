import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAccount = async (req, res) => {
    try {
      const accounts = await prisma.bank_accounts.findMany({
        include: {
          user: true,
        },
      });
      const response = accounts.map((account) => {
        return {
          ...account,
          balance: parseInt(account.balance),
        };
    })
    res.status(201).json(response)
  } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

export const getAccountById = async (req, res) => {
  try {
    const accounts = await prisma.bank_accounts.findUnique({
      where:{
        id : Number(req.params.accountId)
      },
      include: {
        user: true,
      },
    });
  res.status(201).json({
    ...accounts,
    balance : parseInt(accounts.balance)
  })
} catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createAccount = async (req, res) => {
    try {
      const accounts = await prisma.bank_accounts.create({
        data: {
          bank_name: req.body.bank_name,
          bank_account_number: req.body.bank_account_number,
          balance: req.body.balance,
          user_id : req.body.user_id
        },
      });
      const response = accounts.map((account) => {
        return {
          ...accounts,
          balance: parseInt(accounts.balance),
        };
    })

      return res.status(201).json({
        message: "berhasil menambahkan akun",
        data: response,
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

