import { Request, Response } from 'express';
import { createSearchRecord, getUserSearches, deleteUserSearch } from '../services/searchHistoryService.js';
import AppError from '../utils/appError.js';

export async function createSearch(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const { searchTerm } = req.body;

        const newSearch = await createSearchRecord(userId, searchTerm);

        res.status(201).json(newSearch);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

export async function listSearches(req: Request, res: Response) {
    try {
        const userId = req.user!.id;

        const searches = await getUserSearches(userId);

        res.status(200).json(searches)
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

export async function removeSearch(req: Request, res: Response){
    try {
        const userId = req.user!.id;
        const searchId = Number(req.params.id);

        await deleteUserSearch(searchId, userId);

        res.status(204).send();
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}