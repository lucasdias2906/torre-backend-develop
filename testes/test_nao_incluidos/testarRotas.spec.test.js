let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
let vLogin = { login: "cfrigo", senha: "123456" };

//const vUrlBase = "http://localhost:8080";
const vUrlBase = "http://dev.torre.cuboconnect.cloud:8084"

describe('/POST Login', () => {
    it('Verificar a geração do token autenticação', (done) => {

        chai.request(vUrlBase)
            .post('/api/autenticar/login')
            .send(vLogin)
            .end((err, res) => {
                token = res.body.dados.token;
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
    })
});