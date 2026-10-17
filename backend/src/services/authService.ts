import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { insertUser, findUserByEmail, User } from '../models/userModel.js';
import AppError from '../utils/appError.js';

interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        is_admin: boolean;
    };
}

const SALT_ROUNDS = 12;

export async function registerUser(name: string, email: string, password: string): Promise<Omit<User, 'password'>> {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new AppError('E-mail já cadastrado', 409)
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await insertUser(name, email, hashedPassword);
    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new AppError('E-mail ou senha inválidos', 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        throw new AppError('E-mail ou senha inválidos', 401);
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        process.env.JWT_SECRET!,
        { expiresIn: '2h' }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin } };
}