import express from "express";
import cookieParser from "cookie-parser";
import health from "./routes/health.js";
import wallet from "./routes/wallet.js";
import auth from "./routes/auth.js";
import portfolio from "./routes/portfolio.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { startCronJob } from "./services/cronSnapService.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/me", (req, res) => {
  res.json(req.user);
});

app.use('/api/auth', auth);
app.use('/health', health);
app.use('/api/wallet', authMiddleware, wallet);
app.use('/api/portfolio', authMiddleware, portfolio);

startCronJob();


export default app;
