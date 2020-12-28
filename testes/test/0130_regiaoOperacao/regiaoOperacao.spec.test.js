let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const regiaoOP = { "regiaoOperacao": "Diadema TA" };
const regiaoOP2 = { "regiaoOperacao": "São Bernado TA" };
let date = new Date('2099-02-20T20:20:20');

describe('Regiao Operação', () => {

    it('Incluir Regiao Operação', (done) => {
        chai.request(vUrlBase)
            .post('/api/regiaoOperacao')
            .set('x-access-token', global.token)
            .send(regiaoOP) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                global._id = res.body.dados._id;
                global.codigoRegiaoOperacao = res.body.dados.codigoRegiaoOperacao;
                res.body.dados.should.not.have.property('dados')
                res.should.have.status(200);
                done();
            });
    });

    it('Listar Regiao Operação', (done) => {
        chai.request(vUrlBase)
            .get(`/api/regiaoOperacao`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                // res.body.dados.filter(function (elem, i, array) {
                //     global._id = array.indexOf(elem) === 0 ? elem._id : '';
                // });
                done();
            });
    });

    it('Atualizar Regiao Operação', (done) => {

        chai.request(vUrlBase)
            .put(`/api/regiaoOperacao/${global._id}`)
            .set('x-access-token', global.token)
            .send(regiaoOP2) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });

    it('Incluir Vigencia da Regiao Operação', (done) => {

        const regiaoOPVigencia = {

            "codigoRegiaoOperacao": global.codigoRegiaoOperacao,
            "vigenciaRegiaoOperacao": date,
            "custoOleoDiesel": 10,
            "custoGalaoArla": 10,
            "custoLavagem": 10,
            "despesasViagem": 10
        }

        chai.request(vUrlBase)
            .post(`/api/regiaoOperacao/${global.codigoRegiaoOperacao}/vigencia`)
            .set('x-access-token', global.token)
            .send(regiaoOPVigencia)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                global._idVigencia = res.body.dados._id;
                res.body.dados.should.not.have.property('dados')
                res.should.have.status(200);
                done();
            });
    });

    it('Listar Vigencia Regiao Operação', (done) => {
        chai.request(vUrlBase)
            .get(`/api/regiaoOperacao/${global.codigoRegiaoOperacao}/vigencia`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                // res.body.dados.filter(function (elem, i, array) {
                //     global._id = array.indexOf(elem) === 0 ? elem._id : '';
                // });
                done();
            });
    });

    it('Obter Vigencia Regiao Operação', (done) => {

        chai.request(vUrlBase)
            .get(`/api/regiaoOperacao/${global.codigoRegiaoOperacao}/vigencia`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                // res.body.dados.filter(function (elem, i, array) {
                //     global._id = array.indexOf(elem) === 0 ? elem._id : '';
                // });
                done();
            });
    });

    it('Atualizar Vigencia Regiao Operação', (done) => {

        let regiaoOPVigencia2 = {
            "vigenciaRegiaoOperacao": date,
            "custoOleoDiesel": 20,
            "custoGalaoArla": 30,
            "custoLavagem": 40,
            "despesasViagem": 50
        }

        chai.request(vUrlBase)
            .put(`/api/regiaoOperacao/vigencia/${global._idVigencia}`)
            .set('x-access-token', global.token)
            .send(regiaoOPVigencia2) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });
 
    it('Excluir Vigencia da Regiao Operação', (done) => {
       
        chai.request(vUrlBase)
            .delete(`/api/regiaoOperacao/vigencia/${global._idVigencia}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Excluir Regiao Operação', (done) => {
       
        chai.request(vUrlBase)
            .delete(`/api/regiaoOperacao/${global._id}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
