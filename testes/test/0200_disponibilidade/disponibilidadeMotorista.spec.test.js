let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

describe('Disponibilidade Motorista', () => {

    it('Listar a disponibilidade dos motoristas', (done) => {

        chai.request(vUrlBase)
            .get(`/api/disponibilidade/motorista`)
            .set('x-access-token', global.token)
            .query({ situacao: 'D',
                     periodoViagemInicial : '2019-01-01',
                     periodoViagemFinal : '2019-01-01',
                     categoriaCNH: 'A',
                     codigoMotorista : 10
                  })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.not.have.property('dados');
                done();
            });
    });

});
