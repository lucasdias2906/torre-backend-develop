let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;
let vNumeroPedido;

describe('Pedido', () => {

    it('Listar Status Pedido', (done) => {
        chai.request(vUrlBase)
            .get(`/api/pedido/status`)
            .set('x-access-token', 'global.token')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                done();
            });
    });

    it('Listar pedido', (done) => {
        chai.request(vUrlBase)
            .get(`/api/pedido`)
            .set('x-access-token', global.token)
            .query({
                dataRetiradaInicial: '2020-02-01',
                dataRetiradaFinal: '2020-02-01'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                vNumeroPedido = res.body.dados[0].numeroPedido;
                res.body.dados.should.not.have.property('dados');
                done();
            });
    });

    it('Obter Pedido', (done) => {

        chai.request(vUrlBase)
            .get(`/api/pedido/obter`)
            .set('x-access-token', global.token)
            .query({
                dataRetiradaInicial: '2020-02-01',
                dataRetiradaFinal: '2020-02-01',
                numeroPedido: 98040,
                codigoFilial: 38
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                done();
            });
    });
});
