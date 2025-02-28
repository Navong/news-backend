const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger.json");
const newsRoutes = require("./routes/newsRoutes");


const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/news", newsRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});