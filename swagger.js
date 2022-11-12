const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        version: "1.0.0",
        title: "API - Rede Social LR",
        description:
            "<b>API - Rede Social LR</b> foi realizado como um trabalho final da materia de API REST",
    },
    host: "localhost:3000",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    autoHeaders: true,
    autoQuery: true,
    autoBody: true,
};

const outputsFile = "swagger-output.json";
const endpointsFiles = ["./app.js", "./lib/controllers/*.js"];

swaggerAutogen(outputsFile, endpointsFiles, doc).then(async () => {
    //await require("./bin/www");
});
