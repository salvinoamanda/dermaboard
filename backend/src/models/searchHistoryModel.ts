import pool from '../config/database.js';

export interface SearchHistory {
    id: number;
    user_id: number;
    search_term: string;
    searched_at: Date;
}

export async function insertSearch(userId: number, searchTerm: string): Promise<SearchHistory> {
    const result = await pool.query(
        `INSERT INTO search_history (user_id, search_term)
         VALUES ($1, $2)
         RETURNING id, user_id, search_term, searched_at`,
        [userId, searchTerm]
    );

    return result.rows[0];
}

export async function findSearchesByUserId(userId: number): Promise<SearchHistory[]> {
    const result = await pool.query(
        `SELECT id, user_id, search_term, searched_at
         FROM search_history
         WHERE user_id = $1
         ORDER BY searched_at DESC`,
        [userId]
    );

    return result.rows;
}

export async function deleteSearchById(id: number, userId: number): Promise<boolean> {
    const result =  await pool.query(
        `DELETE FROM search_history WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );

    return (result.rowCount ?? 0) > 0;
}