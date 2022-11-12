const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const swaggerFile = require("./swagger-output.json");
const swaggerUI = require("swagger-ui-express");

const indexRouter = require("./lib/routes/index");
const postRouter = require("./lib/routes/post");
const profileRouter = require("./lib/routes/profile");

app.use(cors());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

//IMPLEMENTAR ROTAS DA API AQUI

app.use("/", indexRouter);
app.use("/post", postRouter);
app.use("/profile", profileRouter);

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

mongoose
    .connect("mongodb://127.0.0.1:27017/lr")
    .then(() => {
        app.listen(3000);
        console.log("Banco conectado com sucesso! ");
    })
    .catch(function (err) {
        console.log("Erro ao conectar ao banco! " + err.message);
    });
