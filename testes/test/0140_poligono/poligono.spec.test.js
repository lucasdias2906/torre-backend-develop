let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const tipoPoligono = { "descricao": "Tipo Poligono TA" };

let vPoligonoId;
let vTipoPoligonoId;

describe('Poligono', () => {

    it('Listar Tipo Poligono', (done) => {
        chai.request(vUrlBase)
            .get(`/api/poligono/tipo`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                done();
            });
    });

    it('Incluir Tipo Poligono', (done) => {
        chai.request(vUrlBase)
            .post('/api/poligono/tipo')
            .set('x-access-token', global.token)
            .send(tipoPoligono) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                vTipoPoligonoId = res.body.dados._id;
                res.body.dados.should.not.have.property('dados')
                res.should.have.status(200);
                done();
            });
    });

    it('Listar Poligono', (done) => {
        chai.request(vUrlBase)
            .get(`/api/poligono`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                done();
            });
    });

    it('Incluir Poligono', (done) => {

        let poligono = {
            "descricao": "Cliente Novellis - Fábrica",
            "tipoPoligonoId": `${vTipoPoligonoId}`,
            "hubParceiroId": null,
            "ativo": false,
            "pontos": [{
                "sequenciaPonto": 1,
                "latitude": "21.489879",
                "longitude": "81.990986"
            },
            {
                "sequenciaPonto": 2,
                "latitude": "22.489879",
                "longitude": "82.990986"
            },
            {
                "sequenciaPonto": 3,
                "latitude": "22.489879",
                "longitude": "82.990986"
            }]
        };

        chai.request(vUrlBase)
            .post('/api/poligono')
            .set('x-access-token', global.token)
            .send(poligono) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                vPoligonoId = res.body.dados._id;
                res.body.dados.should.not.have.property('dados')
                res.should.have.status(200);
                done();
            });
    });

    it('Obter Poligono', (done) => {

        console.log("vPoligonoId:", vPoligonoId);

        chai.request(vUrlBase)
            .get(`/api/poligono/${vPoligonoId}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                global.poligono = res.body.dados;
                res.body.dados.should.not.have.property('dados');
                done();
            });
    });


    it('Atualizar Poligono', (done) => {

        global.poligono.descricao = 'Cliente Novellis - Fábrica SP';

        const poligono = {
            descricao: global.poligono.descricao,
            tipoPoligonoId: vTipoPoligonoId,
            pontos: global.poligono.pontos
        }

        chai.request(vUrlBase)
            .put(`/api/poligono/${vPoligonoId}`)
            .set('x-access-token', global.token)
            .send(poligono) 
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });

    it('Alterar status Poligono', (done) => {

        global.poligono.ativo = true;

        const poligono = {
            ativo: global.poligono.ativo
        }

        chai.request(vUrlBase)
            .put(`/api/poligono/${vPoligonoId}/alterarStatus`)
            .set('x-access-token', global.token)
            .send(poligono)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados')
                res.body.dados.should.not.have.property('dados')
                done();
            });
    });

    it('Excluir Poligono', (done) => {

        chai.request(vUrlBase)
            .delete(`/api/poligono/${vPoligonoId}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Excluir tipo da Poligono', (done) => {    

        chai.request(vUrlBase)
            .delete(`/api/poligono/tipo/${vTipoPoligonoId}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
