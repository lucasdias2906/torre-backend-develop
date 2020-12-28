// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797

require('dotenv').config();
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

let vLogin = { login: "uTesteAutomatizado", senha: "123456" };

const vHUM_TMS_HOST = process.env.HUM_TMS_HOST;
const vHUB_TMS_PORT = process.env.HUB_TMS_PORT;

console.log("process.env.HUM_TMS_HOST:", process.env.HUM_TMS_HOST);

//global.urlBase = "http://localhost:8080";
global.urlBase = `http://${vHUM_TMS_HOST}:${vHUB_TMS_PORT}`;

global.moduloId = "11";
global.perfilId = "1";
global.funcionalidadeId = "1";
global.UsuarioUUID = "xxx";

console.log("executando login..." + global.urlBase);

describe('/POST Login API', () => {
    it('Verificar a geração do token autenticação', (done) => {
        chai.request(global.urlBase)
            .post('/api/autenticar/login')
            .send(vLogin)
            .end((err, res) => {
                global.token = res.body.dados.token;                
                res.should.have.status(200);
                done();
            });
    });

    it('Inicializar Dados de Teste', (done) => {
        chai.request(global.urlBase)
            .get('/api/cargaDados/inicializarDadosTeste')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });    

});
