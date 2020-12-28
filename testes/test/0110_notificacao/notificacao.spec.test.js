// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797


let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vNotificacao = {
    "tipoOcorrenciaId": "5e56dd411bb32931c654812d",
    "titulo": "tituloTesteNotificacao",
    "corpo": "corpo Teste",
    "usuarios": [
      {
        "usuarioId": "000000000000000000000001",
        "lido": false
      }
    ],
    "emails": [
      {
        "email": "carlos.saito@cuboconnect.com.br",
        "enviado": false
      }
    ],
    "dataHora": "2020-01-01",
    "placaTemporaria": "AAA111"
  };

 
  const vNotificacaoAlterado = {
    "tipoOcorrenciaId": "5e56dd411bb32931c654812d",
    "titulo": "titulo Teste",
    "corpo": "corpo Teste",
    "usuarios": [
      {
        "usuarioId": "000000000000000000000001",
        "lido": false
      }
    ],
    "emails": [
      {
        "email": "teste@gmail.com",
        "enviado": false
      }
    ],
    "dataHora": "2020-01-01",
    "placaTemporaria": "AAA111"
  };

 let vvNotificacaoAlteradoId;


//const vUrlBase = "http://localhost:8080";
const vUrlBase = global.urlBase

    describe('/Notificação', () => {

        it('Incluir Notificação', (done) => {
            chai.request(vUrlBase)
                .post(`/api/notificacao`)
                .set('x-access-token',  global.token)
                .send(vNotificacao)
                .end((err, res) => {
                    vvNotificacaoAlteradoId = res.body.dados._id;
                    res.should.have.status(200);
                    done();
                });
        });

        it('Listar Notificações', (done) => {
            chai.request(vUrlBase)
                .get(`/api/notificacao`)
                .set('x-access-token', global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Marcar Notificação como lida', (done) => {
            chai.request(vUrlBase)
                .put(`/api/notificacao/${vvNotificacaoAlteradoId}/marcarLido`)
                .set('x-access-token', global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        
        it('Enviar e-mail de notificação', (done) => {
            chai.request(vUrlBase)
                .post(`/api/notificacao/${vvNotificacaoAlteradoId}/enviarEmail`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });
 
