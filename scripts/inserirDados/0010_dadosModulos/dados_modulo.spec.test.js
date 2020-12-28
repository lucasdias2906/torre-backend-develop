let chai = require('chai');
let chaiHttp = require('chai-http');
let item;
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const vLista = [{ "nome": "Programação", "funcionalidades": [{ "nome": "Cargas"}, {"nome": "Viagens"}] },
{ "nome": "Monitoramento", "funcionalidades": [{ "nome": "frota"}] },
{ "nome": "Gestão", "funcionalidades": [{ "nome": "Cadastro de Clientes" }, {"nome": "Cadastro de Motoristas"}, {"nome": "Cadastro de Rotas"}, {"nome": "Cadastro de Veículos"}] },
{ "nome": "Performance" , "funcionalidades": [{ "nome": "Gráficos"}, {"nome": "Relatórios"}]}];



describe('/POST Módulos', () => {

    it('Incluir', (done) => {
        for (let i = 0; i < vLista.length; i++) {
            chai.request(vUrlBase)
                .post('/api/modulo')
                .set('x-access-token', global.token)
                .send(vLista[i])
                .end((err, res) => {
                    if (err) console.log(err);
                    //res.should.have.status(200);

                    const vModuloId = res.body.dados._id;
                    const vFuncionalidades = vLista[i].funcionalidades;

                    if (vFuncionalidades) {
                        for (let j = 0; j < vFuncionalidades.length; j++) {
                            chai.request(vUrlBase)
                                .post(`/api/modulo/${vModuloId}/funcionalidade`)
                                .set('x-access-token', global.token)
                                .send(vFuncionalidades[j])
                                .end((err, res) => {
                                    if (err) console.log(err);
                                    res.should.have.status(200);
                                });
                        }
                    }
                });
        };
        done();
    });
});
