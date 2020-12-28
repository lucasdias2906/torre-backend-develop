let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;

const vUsuarios = require('./dados/usuariosTA.json');
const vLogin = vUsuarios[0].login;
let vUsuarioId;

describe('/POST Usuário', () => {

    it('Incluir Usuário', (done) => {
        for (itemUsuario of vUsuarios) {
            itemUsuario.perfilId = global.perfilId;
            itemUsuario.permissoes[0].moduloId = global.moduloId;
            itemUsuario.permissoes[0].funcionalidadeId = global.funcionalidadeId;
            chai.request(vUrlBase)
                .post('/api/usuario')
                .set('x-access-token', global.token)
                .send(itemUsuario) // vamos enviar esse arquivo
                .end((err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(200);
                    vUsuarioId = res.body.dados._id;
                    done();
                });
        }

    });

    
    it('Alterar Usuário', (done) => {
        for (itemUsuario of vUsuarios) {
            itemUsuario.perfilId = global.perfilId;
            itemUsuario.permissoes[0].moduloId = global.moduloId;
            itemUsuario.permissoes[0].funcionalidadeId = global.funcionalidadeId;
            chai.request(vUrlBase)
                .put(`/api/usuario/${vUsuarioId}`)
                .set('x-access-token', global.token)
                .send(itemUsuario) // vamos enviar esse arquivo
                .end((err, res) => {
                    if(err) console.log(err);
                    res.should.have.status(200);
                    vUsuarioId = res.body.dados._id;
                    done();
                });
        }

    });


    it('Obtém usuário pelo login', (done) => {
        chai.request(vUrlBase)
            .get(`/api/usuario/login/${vLogin}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.have.property('origem').to.equal('TORRE');
                done();
            });
    });

    it('Inativar usuário', (done) => {
        console.log("vUsuarioId", vUsuarioId);
        chai.request(vUrlBase)
            .put(`/api/usuario/${vUsuarioId}/alterarStatus`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.have.property('status').to.equal(false);
                done();
            });
    });

    it('Ativar usuário', (done) => {
        console.log("vUsuarioId", vUsuarioId);
        chai.request(vUrlBase)
            .put(`/api/usuario/${vUsuarioId}/alterarStatus`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                res.body.dados.should.have.property('status').to.equal(true);
                done();
            });
    });

    it('Renovar UUID do usuário', (done) => {
        chai.request(vUrlBase)
            .put(`/api/usuario/renovarUUID/${vUsuarioId}`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                global.UsuarioUUID = res.body.dados.uuidConfirmacao;
                done();
            });
    });

    it('Listar as permissões de acesso - Empresa', (done) => {
        console.log(`/api/usuario/${vUsuarioId}/permissao/empresa`);
        chai.request(vUrlBase)
            .get(`/api/usuario/${vUsuarioId}/permissao/empresa`)
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');
                done();
            });
    });
});
