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
    let second_test_profile;
    let test_comment;
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGNlNmMwODM1YWE0YzNmMjVkOGVhZiIsImVtYWlsIjoiYWRhZ2lvQGdtYWlsLmNvbSIsIm5pY2tuYW1lIjoiU0RPTCIsImlhdCI6MTY3MDE3ODQ5Nn0.XzlgmzWepiSzCw7Z5A0ukTZ6J8KxsxZw_wykpYrU6MY"
    let token;
   

    it("Criação de Perfil", (done) => {
        let newProfile = {
            name: "Adagio",
            nickname: "@SDOL",
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

    it("Criar Segundo Perfil", (done) => {
        let secondProfile = {
            name: "Alberta",
            nickname: "@OSNI",
            email: "alberta@gmail.com",
            password: "senha321",
            creationDate: Date.now(),
        };
        chai.request(host)
            .post("/profile/create")
            .send(secondProfile)
            .end((err, res) => {
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("_id");
                expect(res.body).to.not.have.property("password");
                second_test_profile = res.body;
                second_test_profile.password = secondProfile.password;
                done();
            });
    });

    it("Nickname é unico", (done) => {
        let newProfile = {
            name: "Adagio",
            nickname: "@SDOL",
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
            nickname: "@SDOLdiferente",
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


    it("Primeiro perfil deve seguir segundo Perfil", (done) => {
        chai.request(host)
            .post("/profile/follow/" + second_test_profile._id)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                //2 = perfil original
                //3 = perfil que vai seguir
                expect(res.body[2].followingObjectId).to.not.be.null;
                expect(res.body[2].followersObjectId).to.be.null;
                expect(res.body[3].followingObjectId).to.be.null;
                expect(res.body[3].followersObjectId).to.not.be.null;
                done();
            });
    });

    it("Primeiro perfil deve parar seguir segundo Perfil", (done) => {
        chai.request(host)
            .post("/profile/follow/" + second_test_profile._id)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                //2 = perfil original
                //3 = perfil que vai seguir
                expect(res.body[2].followingObjectId).to.be.null;
                expect(res.body[2].followersObjectId).to.not.be.null;
                expect(res.body[3].followingObjectId).to.not.be.null;
                expect(res.body[3].followersObjectId).to.be.null;
                done();
            });
    });

    //Post
    it("Criação de Postagem", (done) => {
        let newPost = {
            postDate: Date.now(),
            description: "Santa Tell Me",
        };
        chai.request(host)
            .post("/post/create")
            .send(newPost)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.property("_id");
                expect(res.body).to.have.property("posts");
                test_profile = res.body;
                done();
            });
    });

    it("Deve recuperar postagem do Perfil indicado", (done) => {
        chai.request(host)
            .get(`/post/getAllByProfileId/${test_profile._id}`)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body[0]).to.have.property("_id");
                expect(res.body[0]).to.have.property("name");
                expect(res.body[0]).to.have.property("nickname");
                expect(res.body[0]).to.have.property("postDate");
                expect(res.body[0]).to.have.property("description");
                expect(res.body[0]).to.have.property("numberOfLikes");
                expect(res.body[0].numberOfLikes).to.be.equal(0);
                expect(res.body[0]).to.have.property("numberOfReposts");
                expect(res.body[0].numberOfReposts).to.be.equal(0);
                expect(res.body[0]).to.have.property("numberOfComments");
                expect(res.body[0].numberOfComments).to.be.equal(0);
                done();
            });
    });
    //Comment
    it("Inserir Comentario em Postagem", (done) => {
        let newComment = {
            comment: "Its an wonderful world",
            creationDate: Date.now(),
            postObjectId: test_profile.posts[0]._id
        };
        chai.request(host)
            .post(`/comment/create/${test_profile._id}`)
            .send(newComment)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body[0]).to.be.an("object");
                expect(res.body[0]).to.have.property("_id");
                expect(res.body[0]).to.have.property("postObjectId");
                expect(res.body[0]).to.have.property("profileObjectId");
                expect(res.body[0]).to.have.property("comment");
                expect(res.body[0]).to.have.property("creationDate");
                test_comment = res.body[0];
                done();
            });
    });

    it("Comentario deletado", (done) => {
        chai.request(host)// "/deleteById/:profileObjectId/:commentObjectID"
            .delete(`/comment/deleteById/${test_profile._id}/${test_comment._id}`)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.empty;
                done();
            });
    });

    //Post
    it("Postagem deve ser deletada", (done) => {
        chai.request(host)
            .delete(`/post/deleteById/${test_profile._id}/${test_profile.posts[0]._id}`)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.empty;
                done();
            });
    });
    
    // Perfil
    it("Perfil deve ser deletado", (done) => {
        chai.request(host)
            .delete(`/profile/deleteById/${test_profile._id}`)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.empty;
                done();
            });
    });

    it("Segundo perfil deve ser deletado", (done) => {
        chai.request(host)
            .delete(`/profile/deleteById/${second_test_profile._id}`)
            .set("x-access-token", token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.empty;
                done();
            });
    });
});
