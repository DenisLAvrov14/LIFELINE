import { Request, Response } from 'express';
import { createUser as createUserModel } from '../models/user.model';

export const createUser = async (req: Request, res: Response) => {
  const newUser = req.body;

  try {
    const result = await createUserModel(newUser);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error creating user: ", err);
    res.status(500).send({ message: "Error creating user", error: err });
  }
};
