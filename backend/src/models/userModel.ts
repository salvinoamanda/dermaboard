import pool from '../config/database.js';

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
    active: boolean;
}

export async function insertUser(
    name: string,
    email: string,
    hashedPassword: string,
): Promise<User> {
    const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, password, is_admin, active`,
        [name, email, hashedPassword]
    );

    return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
        `SELECT id, name, email, password, is_admin, active FROM users WHERE email = $1`,
        [email]
    );

    return result.rows[0] || null;
}

export async function findUserById(id: number): Promise<User | null> {
    const result = await pool.query(
        `SELECT id, name, email, password, is_admin, active FROM users WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

export async function updateUser(
    id: number,
    fields: { name?: string; password?: string }
): Promise<User | null> {
    const setClauses = [];
    const values = [];
    let index = 1;

    if (fields.name !== undefined) {
        setClauses.push(`name = $${index++}`);
        values.push(fields.name);
    }

    if (fields.password !== undefined) {
        setClauses.push(`password = $${index++}`);
        values.push(fields.password);
    }

    if (setClauses.length === 0) return findUserById(id);

    values.push(id);

    const result = await pool.query(
        `UPDATE users SET ${setClauses.join(', ')}
         WHERE id = $${index}
         RETURNING id, name, email, password, is_admin, active`,
        values
    );

    return result.rows[0] || null;
}

export async function findAllUsers(): Promise<User[]> {
    const result = await pool.query(
        `SELECT id, name, email, password, is_admin, active FROM users`
    );

    return result.rows;
}

export async function deleteUserById(id: number): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1`,
        [id]
    );

    return (result.rowCount ?? 0) > 0;
}