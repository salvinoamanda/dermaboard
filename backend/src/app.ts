import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import searchHistoryRoutes from './routes/searchHistoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/search-history', searchHistoryRoutes);
app.use('/user', userRoutes);
app.use('/users', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Dermaboard API is running' })
});

export default app;