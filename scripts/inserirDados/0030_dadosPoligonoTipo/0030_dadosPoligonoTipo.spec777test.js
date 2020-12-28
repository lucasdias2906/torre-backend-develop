let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const vListaPoligonoTipo = [
    { "descricao": "Área de Risco" },
    { "descricao": "Ponto de Controle" },
    { "descricao": "Operacional" },
    { "descricao": "Fiscalização" },
    { "descricao": "Serviços" },
    { "descricao": "Cliente" },
    { "descricao": "Parada Autorizada" },
    { "descricao": "Embarcador" },
    { "descricao": "Coleta ou Entrega" },
    { "descricao": "Aduana" },
    { "descricao": "Centro de Distribuição" },
    { "descricao": "Check Point de Rotas (Balizas)" },
    { "descricao": "Área de carga" },
    { "descricao": "Área de descarga" },
    { "descricao": "Descanso" }];

describe('/POST Tipo Polígono', () => {

    console.log("vUrlBase:", vUrlBase);

    it('Incluir', (done) => {
        // for (item of vListaPoligonoTipo) 

        for (let i = 0; i < vListaPoligonoTipo.length; i++) {

            chai.request(vUrlBase)
                .post('/api/poligono/tipo')
                .set('x-access-token', global.token)
                .send(vListaPoligonoTipo[i])
                .end((err, res) => {
                    if (err) console.log(err);
                    ///res.should.have.status(200);
                    //vUsuarioId = res.body.dados._id;
                    done();
                });
        }
    });
});
