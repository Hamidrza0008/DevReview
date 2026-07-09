require("dotenv").config();
const cors = require("cors")
const connectDB = require("./config/db");
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes")
const cookieParser = require("cookie-parser");
const projectRoutes = require("./routes/projectRoutes")
const statsRoute = require("./routes/stats.routes");
const userProjectRoute = require("./routes/userProject.routes")



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/stats", statsRoute);
app.get("/", (req, res) => {
    res.send("DevReview Backend Running 🚀");
})

app.use("/api/projects", projectRoutes);
app.use("/api/user/projects" , userProjectRoute);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));