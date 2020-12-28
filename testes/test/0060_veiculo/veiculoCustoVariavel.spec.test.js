// créditos https://medium.com/@rafaelvicio/testando-api-rest-com-mocha-e-chai-bf3764ac2797


let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vVeiculoCustoVariavel = {
    "codigoVeiculo": "AAA1111",
    "codigoRegiaoOperacao": 0,
    "dataVigenciaVariavel": "2025-02-20",
    "custoOleoDiesel": 0,
    "custoMediaConsumo": 0,
    "combustivelPorKm": 0,
    "custoGalaoArla": 0,
    "mediaConsumoArla": 0,
    "arlaPorKm": 0,
    "custoPneu": 0,
    "kmsPorPneu": 0,
    "pneuPorKm": 0,
    "custoLavagem": 0,
    "despesasViagem": 0,
    "comissaoMotorista": 0,
    "custoManutencaoKm": 0
  };

 
  const vVeiculoCustoVariavelAlterado = {
    "codigoVeiculo": "AAA1111",
    "codigoRegiaoOperacao": 0,
    "dataVigenciaVariavel": "2025-02-20",
    "custoOleoDiesel": 0,
    "custoMediaConsumo": 0,
    "combustivelPorKm": 0,
    "custoGalaoArla": 0,
    "mediaConsumoArla": 0,
    "arlaPorKm": 0,
    "custoPneu": 0,
    "kmsPorPneu": 0,
    "pneuPorKm": 20,
    "custoLavagem": 20,
    "despesasViagem": 20,
    "comissaoMotorista": 20,
    "custoManutencaoKm": 20
  };

 let vVeiculoCustoVariavelId;


const vUrlBase = global.urlBase

     describe('Veículo Custo Variável', () => {

        it('Incluir Custo Variável de Veículo', (done) => {
            chai.request(vUrlBase)
                .post(`/api/veiculo/${vVeiculoCustoVariavel.codigoVeiculo}/custoVariavel`)
                .set('x-access-token',  global.token)
                .send(vVeiculoCustoVariavel)
                .end((err, res) => {
                    console.log("res.body.dados._id:", res.body.dados._id);
                    vVeiculoCustoVariavelId = res.body.dados._id;
                    res.should.have.status(200);
                    done();
                });
        });

        

        it('Listagem dos Custos Variáveis de um Veículo', (done) => {
            chai.request(vUrlBase)
                .get(`/api/veiculo/${vVeiculoCustoVariavel.codigoVeiculo}/custoVariavel`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        

        it('Obter um custo variável pelo id', (done) => {
            chai.request(vUrlBase)
                .get(`/api/veiculo/custoVariavel/${vVeiculoCustoVariavelId}`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        

        it('Atualizar Custo Variável de Veículo', (done) => {
            chai.request(vUrlBase)
                .put(`/api/veiculo/custoVariavel/${vVeiculoCustoVariavelId}`)
                .set('x-access-token',  global.token)
                .send(vVeiculoCustoVariavelAlterado)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Exclui um Custo Variável do Veículo', (done) => {
            chai.request(vUrlBase)
                .delete(`/api/veiculo/custoVariavel/${vVeiculoCustoVariavelId}`)
                .set('x-access-token',  global.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });






    });
 
