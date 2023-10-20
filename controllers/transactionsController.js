import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTransaction = async (req, res) => {
  let { source_account_id, destination_account_id, amount } = req.body;
  source_account_id = Number(source_account_id);
  destination_account_id = Number(destination_account_id);
  amount = Number(amount);

  const sourceAccount = await prisma.bank_accounts.findUnique({
    where: {
      id: source_account_id,
    },
  });
  if (!sourceAccount)
    return res.status(404).json({ error: true, msg: "Akun tidak ditemukan" });

  if (sourceAccount.balance < amount)
    return res.status(404).json({ error: true, msg: "Saldo tidak cukup" });

  if (source_account_id === destination_account_id) {
    return res.status(400).json({
      error: true,
      message: "tidak bisa transfer di akun yang sama",
    });
  }
  const destinationAccount = await prisma.bank_accounts.findUnique({
    where: {
      id: destination_account_id,
    },
  });

  if (!destinationAccount)
    return res.status(404).json({ error: true, msg: "akun tidak ditemukan" });

  await prisma.bank_account_transactions
    .create({
      data: {
          source_account_id: source_account_id,
          destination_account_id: destination_account_id,
        amount: amount,
      },
    })
    .then(() => {
      return prisma.bank_accounts.update({
        where: { id: source_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    })
    .then(() => {
      return prisma.bank_accounts.update({
        where: { id: destination_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    })
    .then(() => {
      return res.status(201).json({
        error: false,
        message: "Transfer uang berhasil",
        data: {
          source_account_id,
          destination_account_id,
          amount,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ msg: error.message });
    });
};

export const getTransaction = async (req, res) => {
  try {
    const transactions = await prisma.bank_account_transactions.findMany({
    });
    const response = transactions.map((transaction) => {
      return {
        ...transaction,
        amount: parseInt(transaction.amount),
      };
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transactions = await prisma.bank_account_transactions.findMany({
      where: {
        id: Number(req.params.transaction),
      },
      include: {
        source_account: true,
        destination_account: true,
      },
    });    
    
    const response = transactions.map((transaction) => {
      return {
        id: (transaction.id),
        amount: parseInt(transaction.amount),
        source_account: {
            id :Number(transaction.source_account.id),
            bank_name :transaction.source_account.bank_name,
            bank_account_number :transaction.source_account.bank_account_number,
            balance : Number(transaction.source_account.balance),
            user_id : Number(transaction.source_account.user_id),

        },
        destination_account: {
            id :Number(transaction.destination_account.id),
            bank_name :transaction.destination_account.bank_name,
            bank_account_number :transaction.destination_account.bank_account_number,
            balance : Number(transaction.destination_account.balance),
            user_id : Number(transaction.destination_account.user_id),
        }
      };
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
