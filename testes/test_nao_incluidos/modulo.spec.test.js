// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();

chai.use(chaiHttp);

const vUrlBase = "http://localhost:8080";
// Nossa suite de teste relacionada a artigos
describe('Módulos', () => 

  // No describe podemos passar um texto para identificação 
  describe('/GET Módulos', () => {
        it('Testando GET todos os Módulos', (done) => {
            chai.request(vUrlBase) // Endereço do servidor
                .get('/api/modulo') // endpoint que vamos testar
                .end((err, res) => { // testes a serem realizados
                    res.should.have.status(401); // verificando se o retorno e um status code 200
                    //res.body.dados.should.be.a('array'); // Verificando se o retorno e um array
                  done();
                });
        });
    }),


    describe('/POST Módulo', () => {
      it('Verificar o cadastro de Módulo', (done) => {
          let modulo = { // Vamos deinir o artigo que vamos inserir
              nome: "Meu Módulo" 
          }
            chai.request(vUrlBase)
            .post('/api/modulo')
            .send(modulo) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(400);
              done();
            });
      });
  }),

 );