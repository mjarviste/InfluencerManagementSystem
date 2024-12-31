import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors'
import managerRouter from './routes/manager.route';
import influencerRouter from './routes/influencer.routes';
import accountRouter from './routes/account.routes';

dotenv.config();

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' 
? ['https://influencer-frontend-two.vercel.app']
: ['http://localhost:5173'];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/influencers', influencerRouter);
app.use('/api/managers', managerRouter);
app.use('/api/accounts', accountRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));