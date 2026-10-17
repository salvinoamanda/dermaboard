import { Request, Response } from 'express';
import { updateUserProfile, getAllUsers, deleteUser } from '../services/userService.js';
import AppError from '../utils/appError.js';

export async function updateProfile(req: Request, res: Response) {
    try {
        const { name, password } = req.body;
        const updatedUser = await updateUserProfile(req.user!.id, { name, password });

        res.status(200).json(updatedUser);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

export async function listUsers(req: Request, res: Response) {
    try {
        const users = await getAllUsers();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

export async function removeUser(req: Request, res: Response) {
    try {
        const userId = Number(req.params.id);

        await deleteUser(userId);

        res.status(204).send();
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}