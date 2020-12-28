// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797

let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

const vUsuarios = require('../test/dados/usuarios.json');

const vUrlBase = "http://localhost:8080";
// Nossa suite de teste relacionada a artigos
describe('Usuários', () =>

    describe('/POST Usuário', () => {
        it('Verificar o cadastro de Usuários', (done) => {

            for (itemUsuario of vUsuarios) {
              chai.request(vUrlBase)
                .post('/api/usuario')
                .send(itemUsuario) // vamos enviar esse arquivo
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
            }


            //let usuario = { // Vamos definir o artigo que vamos inserir
            //    nome: "Usuario01"
           // }
            
        });
    }),

    // No describe podemos passar um texto para identificação 
    describe('/GET Usuários', () => {
        it('Testando GET todos os Usuários', (done) => {
            chai.request(vUrlBase) // Endereço do servidor
                .get('/api/usuario') // endpoint que vamos testar
                .end((err, res) => { // testes a serem realizados
                    res.should.have.status(200); // verificando se o retorno e um status code 200
                    res.body.dados.should.be.a('array'); // Verificando se o retorno e um array
                    done();
                });
        });
    }),
    describe('/GET Usuário', () => {
        it('Testando GET Usuário', (done) => {

            let pCodigoVeiculo = 1;

            chai.request(vUrlBase)
                .get(`/api/veiculo/${pCodigoVeiculo}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    }),
);