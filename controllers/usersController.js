import { PrismaClient } from "@prisma/client";
// const bcrypt = require('bcrypt');
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const cryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt(5)
  
  return bcrypt.hash(password, salt)
}

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const user = await prisma.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await cryptPassword(req.body.password),
        profile: {
          create :{
            identity_number: req.body.identity_number,
            identity_type: req.body.identity_type,
            address: req.body.address,
          }
        }
      },
    });
    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const loginUser = async (req, res) =>{
  const findUser = await prisma.users.findFirst({
    where:{
      email : req.body.email
    }
  })
  if(!findUser){
    return res.status(400).json({
      error : "user tidak ditemukan"
    })
  }
  if(bcrypt.compareSync(req.body.password, findUser.password)){
    const token = jwt.sign({id : findUser.id},'secret_key',{expiresIn: '6h'})

    return res.status(200).json({
      data:{
        token
      }
    })
  }

  return res.status(400).json({
    error: "email atau password salah"
  })
}
export const getProfil = async(req, res) =>{
  try {
    const user = await prisma.users.findUnique({
      where:{
        id: res.user.id
      }
    })
    return res.status(200).json({
      data: user
    })
  } catch (error) {
    
  }
}

export const getUser = async (req, res) => {
  try {
    const response = await prisma.users.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await prisma.profiles.findMany({
      where: {
        id: Number(req.params.userId),
      },
      include: {
        user: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await prisma.users.update({
      where: {
        id: Number(req.params.userId),
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    });

    const profile = await prisma.profiles.update({
      where: {
        user_id: Number(req.params.userId),
      },
      data: {
        identity_number: req.body.identity_number,
        identity_type: req.body.identity_type,
        address: req.body.address,
        user: {
          connect: { id: user.id },
        },
      },
    });
    return res.status(200).json({
      data: profile,
      user: user,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
      const profile = await prisma.profiles.delete({
        where: {
          id: Number(req.params.userId),
        },
      });
    const user = await prisma.users.delete({
      where: {
        id: Number(req.params.userId),
      },
    });

    return res.status(200).json({
      data: "data berhasil dihapus",
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

