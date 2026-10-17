import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set and have at least 32 characters');
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server runnig at http://localhost:${PORT}`);
});