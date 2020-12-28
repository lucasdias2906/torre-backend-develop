// Testa todas as rotas da API

//let expect = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
let vLogin = { login: "cfrigo", senha: "123456" };

//const vUrlBase = "http://localhost:8080";
const vUrlBase = "http://dev.torre.cuboconnect.cloud:8084"

const vEndpoints = [
    "/api/modulo",
    //"/api/modulo/23423/funcionalidade",
    "/api/perfil",
    //"/api/perfil/idddd",
    //"/api/perfil/idddd"/permissao,
    //"/api/perfil/idddd"/moduloId/permissao,
    "/api/empresa",
    //"/api/empresa/idempresa",
    //"/api/empresa/idempresa/filial",
    "/api/filial",
    //"/api/filial/idfilial",
    "/api/usuario",
    //"/api/usuario/idusuario",
    ///api/usuario/idusuario/permissao",
    ///api/usuario/idusuario/permissao/empresa",
    
     "/api/motorista",
     "/api/veiculo",
     
];

describe('/POST Login', () => {
    it('Verificar a geração do token autenticação', (done) => {

        chai.request(vUrlBase)
            .post('/api/autenticar/login')
            .send(vLogin)
            .end((err, res) => {
                global.token = res.body.dados.token;
                res.should.have.status(200);
                done();
            });
    });

    describe('/GET Usuário ', () => {
        it('Verificar a listagem de usuário com token', (done) => {

            chai.request(vUrlBase)
                .get('/api/usuario')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });

        });


    });
});