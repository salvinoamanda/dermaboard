import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.js';
import AppError from '../utils/appError.js';

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        const newUser =  await registerUser(name, email, password);

        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        res.status(200).json(result);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}