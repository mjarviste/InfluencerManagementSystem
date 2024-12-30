import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import managerRouter from './routes/manager.route';
import influencerRouter from './routes/influencer.routes';
import accountRouter from './routes/account.routes';

dotenv.config();

const app = express();
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/influencers', influencerRouter);
app.use('/api/managers', managerRouter);
app.use('/api/accounts', accountRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));