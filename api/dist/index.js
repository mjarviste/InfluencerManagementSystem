"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const manager_route_1 = __importDefault(require("./routes/manager.route"));
const influencer_routes_1 = __importDefault(require("./routes/influencer.routes"));
const account_routes_1 = __importDefault(require("./routes/account.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://influencer-frontend-two.vercel.app']
    : ['http://localhost:5173', 'http://localhost:4173'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error(`Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/influencers', influencer_routes_1.default);
app.use('/api/managers', manager_route_1.default);
app.use('/api/accounts', account_routes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//# sourceMappingURL=index.js.map