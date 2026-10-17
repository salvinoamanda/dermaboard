import bcrypt from 'bcrypt';
import { updateUser, findUserById, findAllUsers, deleteUserById, User } from '../models/userModel.js';
import AppError from '../utils/appError.js';

const SALT_ROUNDS = 12;

export async function updateUserProfile(
    id: number,
    data: { name?: string; password?: string }
): Promise<Omit<User, 'password'>> {
    const currentUser = await findUserById(id);

    if (!currentUser) {
        throw new AppError('Usuário não encontrado', 404);
    }

    const updateData: { name?: string; password?: string } = {
        name: data.name,
    };

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const updatedUser = await updateUser(id, updateData);
    const { password: _, ...userWithoutPassword } = updatedUser!;

    return userWithoutPassword;
}

export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await findAllUsers();

    return users.map((user) => {
        const { password: _, ...userWithoutPassword } = user;

        return userWithoutPassword;
    });
}

export async function deleteUser(id: number) {
    const deleted = await deleteUserById(id);

    if (!deleted){
        throw new AppError('Usuário não encontrado', 404);
    }
}