// let app = require('../');//importa a bin
let chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;
require("dotenv").config({ path: "./variables.env" });

//IMPORTANTE TROCAR AQUI QUANDO FOR MOSTRAR O FUNCIONAMENTO EM SALA
const host = process.env.HOST + ":" + process.env.PORT_API;

chai.use(chaiHttp);

describe("Testes de Perfil", () => {
    let test_profile;
    //LUIGGI esse token e exatamente o que sera gerado pelo profile teste OK
    let token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGNlNmMwODM1YWE0YzNmMjVkOGVhZiIsImVtYWlsIjoiYWRhZ2lvQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoiU0RPTCIsImlhdCI6MTY3MDE3ODQ5Nn0.XzlgmzWepiSzCw7Z5A0ukTZ6J8KxsxZw_wykpYrU6MY";

    it("Criação de Perfil", (done) => {
        let newProfile = {
            name: "Adagio",
            nickname: "SDOL",
            email: "adagio@gmail.com",
            password: "senha123",
            creationDate: Date.now(),
        };
        chai.request(host)
            .post("/profile/create")
            .send(newProfile)
            .end((err, res) => {
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("_id");
                expect(res.body).to.not.have.property("password");
                test_profile = res.body;
                test_profile.password = newProfile.password;
                done();
            });
    });

    it("Nickname é unico", (done) => {
        let newProfile = {
            name: "Adagio",
            nickname: "SDOL",
            email: "diferente@gmail.com",
            password: "senha123",
            creationDate: Date.now(),
        };

        chai.request(host)
            .post("/profile/create")
            .send(newProfile)
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("msg");
                done();
            });
    });

    it("Email é unico", (done) => {
        let newProfile = {
            name: "Adagio",
            nickname: "SDOLdiferente",
            email: "adagio@gmail.com",
            password: "senha123",
            creationDate: Date.now(),
        };

        chai.request(host)
            .post("/profile/create")
            .send(newProfile)
            .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("msg");
                done();
            });
    });

    it("Login", (done) => {
        chai.request(host)
            .post("/login/")
            .send({
                email: test_profile.email,
                password: test_profile.password,
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("token");

                token = res.body.token;
                done();
            });
    });

    // RAFAEL não sei mexer com o token, faz esse
    it("Buscar perfil por ID", (done) => {
        chai.request(host)
            .get(`/profile/getById/` + test_profile._id)
            .set("x-access-token", token)

            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("name");
                expect(res.body).to.have.property("nickname");
                expect(res.body).to.have.property("email");
                expect(res.body).to.have.property("creationDate");
                expect(res.body).to.not.be.equal(test_profile.password);
                expect(res.body).to.have.property("_id");
                expect(res.body._id).to.be.equal(test_profile._id);
                done();
            });
    });

    //RAFAEEEEEEEL token :3
    it("Buscar perfil por Nickname", (done) => {
        chai.request(host)
            .get("/profile/getByNickname/" + test_profile.nickname)
            .set("x-access-token", token)

            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("_id");
                expect(res.body).to.have.property("name");
                expect(res.body).to.have.property("email");
                expect(res.body).to.have.property("creationDate");
                expect(res.body.password).to.not.be.equal(
                    test_profile.password
                );
                expect(res.body).to.have.property("nickname");
                expect(res.body.nickname).to.be.equal(test_profile.nickname);
                done();
            });
    });

    //RAFAEL passa o token nesse e testa (npm test)
    it("Perfil deve ser deletado", (done) => {
        chai.request(host)
            .delete("/profile/deleteById/" + test_profile._id)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.empty;
                done();
            });
    });
});
