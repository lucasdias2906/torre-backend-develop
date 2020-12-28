let chai = require('chai');
let chaiHttp = require('chai-http');
let item;
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const vListaParceiroClassificacao = [{ "identificacaoClassificacao": 0, "descricaoClassificacao": "CLIENTE/FORNECEDOR" },
{ "identificacaoClassificacao": 1, "descricaoClassificacao": "CLIENTE" },
{ "identificacaoClassificacao": 2, "descricaoClassificacao": "FORNECEDOR" },
{ "identificacaoClassificacao": 3, "descricaoClassificacao": "CARRETEIRO" },
{ "identificacaoClassificacao": 4, "descricaoClassificacao": "AVULSO" },
{ "identificacaoClassificacao": 5, "descricaoClassificacao": "FUNCIONARIO" },
{ "identificacaoClassificacao": 6, "descricaoClassificacao": "IMPOSTO" },
{ "identificacaoClassificacao": 7, "descricaoClassificacao": "FINANCIAMENTO" },
{ "identificacaoClassificacao": 8, "descricaoClassificacao": "CLIENTE/CARRETEIRO" },
{ "identificacaoClassificacao": 9, "descricaoClassificacao": "FORNECEDOR/CARRETEIRO" },
{ "identificacaoClassificacao": 10, "descricaoClassificacao": "CLIENTE/FUNCIONARIO" },
{ "identificacaoClassificacao": 11, "descricaoClassificacao": "CLIENTE/FORNECEDOR/CARRETEIRO" }];



describe('/POST Parceiro Classificacao', () => {

    it('Incluir', (done) => {

        for (let i = 0; i < vListaParceiroClassificacao.length; i++) {

            chai.request(vUrlBase)
                .post('/api/classificacaoParceiro')
                .set('x-access-token', global.token)
                .send(vListaParceiroClassificacao[i])
                .end((err, res) => {
                    if (err) console.log(err);
                });

            if (i === vListaParceiroClassificacao.length - 1) done();
        }
    });
});
