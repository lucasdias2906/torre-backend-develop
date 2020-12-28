let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const vUrlBase = global.urlBase;
let vTokenTeste;

describe('Autenticação', () => {
    
    it('Alterar senha', (done) => {
        console.log("global.UsuarioUUID>>>", global.UsuarioUUID);
        chai.request(vUrlBase)
            .post(`/api/autenticar/alterarSenha/${global.UsuarioUUID}`)
            .send({ "login": "loginTA", "senha": "123456" })
            .set('x-access-token', global.token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');                
                done();
            });
    });

    it('Autenticar Usuário do Teste', (done) => {
        chai.request(vUrlBase)
            .post('/api/autenticar/login')
            .send({ "login": "loginTA", "senha": "123456" }) // vamos enviar esse arquivo
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('dados');  
                vTokenTeste = res.body.dados.token;
                console.log("vTokenTeste: ", vTokenTeste);
                done();
            });
    });

    it('Revalidar Token Usuário do Teste', (done) => {
        console.log("vTokenTeste>> ", vTokenTeste);
        chai.request(vUrlBase)
            .post('/api/autenticar/revalidarToken')
            .send({ "token": vTokenTeste }) 
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Invalidar Token Usuário do Teste', (done) => {
        chai.request(vUrlBase)
            .post('/api/autenticar/invalidarToken')
            .send({ "token": vTokenTeste }) 
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Enviar Email Usuário do Teste', (done) => {
        chai.request(vUrlBase)
            .post('/api/autenticar/enviarEmail')
            .send({ "login": "loginTA" }) 
            .end((err, res) => {
                res.should.have.status(200);
                res.body.dados.should.have.property('mensagem').to.equal('enviado!!!');
                done();
            });
    });


});

