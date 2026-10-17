import { insertSearch, findSearchesByUserId, deleteSearchById, SearchHistory } from '../models/searchHistoryModel.js';
import AppError from '../utils/appError.js';

export async function createSearchRecord(userId: number, searchTerm: string): Promise<SearchHistory> {
    if (!searchTerm || searchTerm.trim() === '') {
        throw new AppError('O termo de pesquisa é obrigatório', 400);
    }

    return await insertSearch(userId, searchTerm);
}

export async function getUserSearches(userId: number): Promise<SearchHistory[]> {
    return await findSearchesByUserId(userId);
}

export async function deleteUserSearch(id: number, userId: number) {
    const deleted = await deleteSearchById(id, userId);

    if (!deleted) {
        throw new AppError('Busca não encontrada', 404);
    }
}