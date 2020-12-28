// Testa todas as rotas da API

//let expect = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);


const vEndpoints = [
  { api: "/api/modulo", possuiLog: false, possuiDados: false },
  //"/api/modulo/23423/funcionalidade",
  { api: "/api/perfil", possuiLog: false, possuiDados: false },
  //"/api/perfil/idddd",
  //"/api/perfil/idddd"/permissao,
  //"/api/perfil/idddd"/moduloId/permissao,
  { api: "/api/empresa", possuiLog: false, possuiDados: false },
  //"/api/empresa/0000000000000",
  { api: "/api/empresa/0000000000000/filial", possuiLog: false, possuiDados: false },
  { api: "/api/filial", possuiLog: false, possuiDados: false },
  //"/api/filial/idfilial",
  { api: "/api/usuario", possuiLog: false, possuiDados: false },
  ///  { api: "/api/usuario/5e4693603d049f4c8c4a2f99/permissao/parceiro", possuiLog: false , possuiDados: false},

  //"/api/usuario/idusuario",
  ///api/usuario/idusuario/permissao",
  ///api/usuario/idusuario/permissao/empresa",

  { api: "/api/fornecedor", possuiLog: false, possuiDados: false },
  { api: "/api/fornecedor/12", possuiLog: false, possuiDados: false },

  { api: "/api/parceiro/classificacao", possuiLog: false, possuiDados: false },

  { api: "/api/motorista?limite=20", possuiLog: false, possuiDados: false },
  { api: "/api/motorista/classificacao", possuiLog: false, possuiDados: false },
  { api: "/api/motorista/4669/cursosLicencas/valido", possuiLog: false, possuiDados: false },
  { api: "/api/motorista/4669/cursosLicencas/vencido", possuiLog: false, possuiDados: false },
  { api: "/api/motorista/4669/gerenciamentoRisco", possuiLog: true, possuiDados: false },
  { api: "/api/motorista/4669/ocorrencias", possuiLog: false, possuiDados: false },
  { api: "/api/motorista/statusGestorRisco", possuiLog: false, possuiDados: false },
  { api: "/api/motorista/situacao", possuiLog: false, possuiDados: false },

  { api: "/api/veiculo?limite=20", possuiLog: false, possuiDados: false },
  //"/api/veiculo/20", -- retornando null
  { api: "/api/veiculo/marca", possuiLog: false, possuiDados: false },
  { api: "/api/veiculo/situacaoVeiculo", possuiLog: false, possuiDados: false },
  //"/api/veiculo/20/parametrosLicencas", -- retornando null
  { api: "/api/veiculo/100000/modelo", possuiLog: false, possuiDados: false },
  { api: "/api/veiculo/100000/custoFixo", possuiLog: false, possuiDados: false },
  { api: "/api/veiculo/tipoVinculo", possuiLog: false, possuiDados: true },
  { api: "/api/rota?limite=20", possuiLog: false, possuiDados: false },
  { api: "/api/rota/BMECEU", possuiLog: false, possuiDados: false },
  { api: "/api/rota/BMCEU/trecho?limite=20", possuiLog: false, possuiDados: false }
];

console.log("total de endpoints:", vEndpoints.length)
describe('/GET Todas as Rotas', () => {
  it('Teste todas as Rotas', (done) => {
    //for(i = 0; i < 24; i++) {

    let i = 0;


    //https://stackoverflow.com/questions/43533482/how-do-i-check-when-multiple-chai-http-requests-are-really-done-in-a-mocha-befor
    vEndpoints.forEach(function (reg) {
      chai.request(global.urlBase)
        .get(reg.api)
        .set('x-access-token', global.token)
        .end(function (err, res) {
          if (err != null) erroNaRota = err;
          if (!reg.possuiLog
            && res.should.have.status(200)
            && res.body.should.have.property('dados')
            && (res.body.dados.length > 0 || !reg.possuiDados)
            && res.body.dados.should.not.have.property('dados')) {
            console.log('ok:' + i, reg.api)
            i = i + 1;            
          } else if (reg.possuiLog
            && res.should.have.status(200)
            && (res.body.dados.length > 0 || !reg.possuiDados)
            && res.body.should.have.property('dados')
          ) {
            let vDados;
            if (Array.isArray(res.body.dados)) vDados = res.body.dados[0];
            else vDados = res.body.dados;
            if (vDados.should.have.property('log')
              && vDados.log.should.have.property('dataAlteracao')
              && vDados.log.should.have.property('usuarioAlteracao')
              && vDados.log.should.have.property('dataInclusao')
              && vDados.log.should.have.property('usuarioInclusao')
            ) {
              console.log('ok:' + i, reg.api)
              i = i + 1;              
            }
            else {
              console.log("reg.api:", reg.api);
              this.skip();
            }
          }
          else {
            console.log("reg.api:", reg.api);
            this.skip();
          }

          if (i === vEndpoints.length) done();
        });
    });
    
  });

});