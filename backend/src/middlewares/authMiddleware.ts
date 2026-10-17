import {  Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
    id: number;
    email: string;
    is_admin: boolean;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Nenhum token fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ message: 'Acesso restrito a administradores' });
    }

    next();
}