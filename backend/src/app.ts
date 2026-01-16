import express from "express";
import health from "./routes/health";
import wallet from "./routes/wallet";
import { fakeAuth } from "./middleware/fakeAuth";

const app = express();

app.use(fakeAuth);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/health', health);
app.use('/wallet', wallet);

export default app;