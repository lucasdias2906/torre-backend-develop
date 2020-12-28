// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797

let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

describe('/Perfil', () => {

    it('Incluir Perfil', (done) => {
        console.log("global.moduloId: ", global.moduloId);
        console.log("global.funcionalidadeId: ", global.funcionalidadeId);

        const vDadosPerfil = {
            "nome": "perfilTA",
            "status": true,
            "descricao": "Perfil de Teste TA",
            "usuarioInclusao": "admin",
            "usuarioAlteracao": "admin",
            "permissoes": [
              {
                "moduloId": global.moduloId,
                "funcionalidadeId": global.funcionalidadeId,
                "permiteAlterar": true,
                "permiteConsultar": true
              }
            ]
          };
        
        chai.request(vUrlBase)
            .post('/api/perfil')
            .set('x-access-token', global.token)
            .send(vDadosPerfil) 
            .end((err, res) => {
                console.log("vDadosPerfil:", vDadosPerfil);
                //console.log("Perfil inserido:" + res.body.dados._id);         
                console.log("res.body:",res.body);
                global.perfilId = res.body.dados._id;
                res.should.have.status(200);
                //global.moduloId = res.body.dados._id;
                done();
            });
    });

    it('Inativar o perfil', (done) => {
      chai.request(vUrlBase)
          .put(`/api/perfil/${global.perfilId}/alterarStatus`)
          .set('x-access-token', global.token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('dados');
              done();
          });
    });

    it('Ativar o perfil', (done) => {
      chai.request(vUrlBase)
          .put(`/api/perfil/${global.perfilId}/alterarStatus`)
          .set('x-access-token', global.token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('dados');
              done();
          });
    });


    it('Obter um perfil', (done) => {
      chai.request(vUrlBase)
          .get(`/api/perfil/${global.perfilId}`)
          .set('x-access-token', global.token)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('dados');
              res.body.dados.should.not.have.property('dados');
              done();
          });
    });

    it('Obter Veículo por codigoVeiculo', (done) => {
        chai.request(vUrlBase)
            .get(`/api/veiculo/${global.codigoVeiculo}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
