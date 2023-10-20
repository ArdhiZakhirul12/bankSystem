import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/usersRoute.js";
import accountRoute from "./routes/accountsRoute.js";
import transactionRoute from "./routes/transactionsRouter.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
import swaggerUi  from "swagger-ui-express";

import swaggerJson from "./openapi.json" assert { type: "json" };

const app = express();
app.use(express.json({ strict: false }));
app.use('/documentation',swaggerUi.serve,swaggerUi.setup(swaggerJson))
app.use("/api/v1", userRoute);
app.use("/api/v1", accountRoute);
app.use("/api/v1", transactionRoute);
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
