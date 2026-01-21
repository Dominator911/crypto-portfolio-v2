import express from "express";
import health from "./routes/health.js";
import wallet from "./routes/wallet.js";
import auth from "./routes/auth.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();

app.use(express.json());

// fake auth applied to ALL routes

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// test route to verify fake auth
app.get("/me", (req, res) => {
  res.json(req.user);
});

app.use('/api/auth', auth);
app.use('/health', health);
app.use('/api/wallet', authMiddleware, wallet);


export default app;