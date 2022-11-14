const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config({ path: "./variables.env" });
const jwt = require("jsonwebtoken");

const swaggerFile = require("./swagger-output.json");
const swaggerUI = require("swagger-ui-express");

const authVerify = require("./authVerify");

const indexRouter = require("./lib/routes/index");
const postRouter = require("./lib/routes/post");
const profileRouter = require("./lib/routes/profile");
const commentsRouter = require("./lib/routes/comment");
const authRouter = require("./lib/routes/auth");

app.use(cors());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

//IMPLEMENTAR ROTAS DA API AQUI

app.use("/", indexRouter);
app.use("/login", authRouter);
app.use("/post", authVerify.private, postRouter);
app.use("/profile", profileRouter);
app.use("/comment", authVerify.private, commentsRouter);

mongoose
    .connect(process.env.URL_MONGO_DB)
    .then(() => {
        app.listen(process.env.PORT_API);
        console.log("Banco conectado com sucesso!");
    })
    .catch(function (err) {
        console.log("Erro ao conectar ao banco! " + err.message);
    });
