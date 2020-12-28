const axios = require('axios');
const jsonfile = require('jsonfile');

console.log("Gerando dados de teste....");

const vUsuarioRandomico = `https://randomuser.me/api/?nat=br`;
const vUrl = 'http://localhost:8080/api'
const vParams = {};

principal();

 
const file = './test/dados/usuarios.json'
//const obj = { name: 'JP' }
 
//jsonfile.writeFileSync(file, obj)

async function principal() {
    await gerarDados();
    await gerarUsuarios();
}

async function obterUsuarioRandomico() {
   vRetorno = await axios.get(vUsuarioRandomico, {});
   return vRetorno.data;
}

async function obterPerfil() {
    vRetorno = await axios.get(vUrl + '/perfil', {});
    return vRetorno.data.dados;
}

async function obterPermissoes(){
    const vDados = await axios.get(vUrl + '/modulo', {});
    const vModulos = vDados.data.dados;
    const vRetorno = [];

    for(item of vModulos) {
        const vUrlFuncionalidade = `${vUrl}/modulo/${item._id}/funcionalidade`;
        //console.log('vUrl:', vUrlFuncionalidade);
        const vRetornoFuncionalidade = await axios.get(vUrlFuncionalidade, {});
        const vFuncionalidades = vRetornoFuncionalidade.data.dados;
        //console.log(vFuncionalidades);
        for(itemFunc of vFuncionalidades) {
            vRetorno.push({
                "moduloId": item._id,
                "funcionalidadeId": itemFunc._id,
                "permiteAlterar": true,
                "permiteConsultar": true
            })
        }

    }

    return vRetorno;
}

async function gerarDados() {
    const vModulos = await axios.get(vUrl + '/modulo', { params: vParams });
}

async function gerarUsuarios() {

    let vUsuarios = [];
    let vUsuarioRandomico = null;  

    for (i = 0; i < 30; i++) {
        const vRetorno = await obterUsuarioRandomico();
        const vPerfil = await obterPerfil();        
        const vItem = vRetorno.results[0];
        const vPermissoes = await obterPermissoes();

        //console.log(vPermissoes);

        //console.log("Perfil",vPerfil[0]);
        //console.log(vItem.name);
        //console.log(vItem.login);
        const vItemSexo = vItem.gender === "female" ? "F" : "M";

        const vUsuario = {
            "nome": vItem.name.first + ' ' +  vItem.name.last,
            "login": vItem.login.username,
            "senha": vItem.login.password,
            "email": vItem.email,
            "celular": "123123123213",
            "telefone": "123123123213",
            "cpf": "123123123213",
            "ehCliente": false,
            "sexo": vItemSexo,
            "status": true,
            "dataNascimento": vItem.dob.date,
            "perfilId": vPerfil[0]._id,
            "permissoes": vPermissoes,
            "empresas": [
              {
                "hubEmpresaId": 1,
                "filiais": [
                  {
                    "hubFilialId": 
                  }
                ]
              }
            ]
          };
          
        
        vUsuarios.push(vUsuario);
    }

    jsonfile.writeFileSync(file, vUsuarios, { spaces: 2, EOL: '\r\n' });

    console.log("usuários gerados!!");
     
}



//console.log("Fim geração dados de teste.");


