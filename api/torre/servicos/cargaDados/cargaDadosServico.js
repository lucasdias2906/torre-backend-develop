/* eslint-disable import/no-dynamic-require */
import mongoose from 'mongoose'
import fs from 'fs'

import _funcionalidadeRepositorio from '../../repositorios/funcionalidadeRepositorio'
import _moduloRepositorio from '../../repositorios/moduloRepositorio'
import _usuarioRepositorio from '../../repositorios/usuarioRepositorio'
import _perfilRepositorio from '../../repositorios/perfilRepositorio'
import _parceiroClassificacaoRepositorio from '../../repositorios/parceiroClassificacaoRepositorio'
import _poligonoTipoRepositorio from '../../repositorios/poligonoTipoRepositorio'
import _veiculoTipoVinculoRepositorio from '../../repositorios/veiculoTipoVinculoRepositorio'
import _veiculoClassificacaoRepositorio from '../../repositorios/veiculoClassificacaoRepositorio'
import _veiculoSituacaoRepositorio from '../../repositorios/veiculoSituacaoRepositorio'
import _pedidoStatusRepositorio from '../../repositorios/pedidoStatusRepositorio'
import _parametroGeralRepositorio from '../../repositorios/parametroGeralRepositorio'

const funcionalidadeRepositorio = new _funcionalidadeRepositorio()
const moduloRepositorio = new _moduloRepositorio()
const usuarioRepositorio = new _usuarioRepositorio()
const perfilRepositorio = new _perfilRepositorio()
const parceiroClassificacaoRepositorio = new _parceiroClassificacaoRepositorio()
const poligonoTipoRepositorio = new _poligonoTipoRepositorio()
const veiculoTipoVinculoRepositorio = new _veiculoTipoVinculoRepositorio()
const veiculoClassificacaoRepositorio = new _veiculoClassificacaoRepositorio()
const veiculoSituacaoRepositorio = new _veiculoSituacaoRepositorio()
const pedidoStatusRepositorio = new _pedidoStatusRepositorio()
const parametroGeralRepositorio = new _parametroGeralRepositorio()

const vTorreModuloId = mongoose.Types.ObjectId('000000000000000000000001')
const vTorreFuncionalidadeId = mongoose.Types.ObjectId('000000000000000000000001')

const vTorrePerfilId = mongoose.Types.ObjectId('000000000000000000000001')
const vTorreUsuarioId = mongoose.Types.ObjectId('000000000000000000000001')
const vTorreVeiculoCustoFixoId = mongoose.Types.ObjectId('000000000000000000000001')

async function inicializarParametroGeral() {
  const vLista = [
    { grupo: 'geral', codigo: 'urlBase', nome: 'url base do sistema', valor: 'http://10.0.0.77:4000', tipo: 'STRING' },

    { grupo: 'login', codigo: 'qtdMaximaTentativa', nome: 'número de tentativas máxima de erro no login', valor: '3', tipo: 'INTEIRO' },

    { grupo: 'monitoramento', codigo: 'TEMPO_PADRAO_CARREGAMENTO', nome: 'Tempo de Carregamento Padrão (Formato HH:MM)', valor: '02:00', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'TEMPO_PADRAO_DESCARGA', nome: 'Tempo de Descarga Padrão (Formato HH:MM)', valor: '02:00', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'PRAZO_VERIFICACAO_ALOCACAO_VEICULO', nome: 'Quantas horas antes do início da viagem inicia verificação de Alocação (Formato HH)', valor: '48', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'PRAZO_LIMITE_ALOCACAO_VEICULO', nome: 'Quantas horas antes deve ser alocado o Veículo/Motorista (Formato HH)', valor: '24', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'PRAZO_VERIFICACAO_CAVALO', nome: 'Quantas horas sem comunicação com o Cavalo deve ser notificada uma ocorrência (Formato HH)', valor: '2', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'PRAZO_VERIFICACAO_CARRETA', nome: 'Quantas horas sem comunicação com a Carreta deve ser notificada uma ocorrência (Formato HH)', valor: '2', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'EMAILS_ADMINISTRATIVOS_TORRE', nome: 'Emails administrativos para notificação de ocorrências (Formato E-mails separados por ;)', valor: 'pablo.xavier@cuboconnect.com.br; paulo.souza@cuboconnect.com.br;', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'HORARIO_INICIO_MONITORAMENTO', nome: 'Hora do dia em que deve ser iniciado o processo de monitoramento diário (Formato HH)', valor: '6', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'HORARIO_TERMINO_MONITORAMENTO', nome: 'Hora do dia em que deve ser interrompido o processo de monitoramento diário (Formato HH)', valor: '20', tipo: 'STRING' },
    { grupo: 'monitoramento', codigo: 'ITEM_MONITORAMENTO_RASTREADOR', nome: 'Indicador de qual será o alvo para monitoramento em deslocamento/carregamento/descarga (Formato CAVALO ou CARRETA)', valor: 'CAVALO', tipo: 'STRING' },

  ]

  for (let i = 0; i < vLista.length; i += 1) {
    const vExiste = await mongoose.connection.db.collection('torreParametroGeral').findOne({ grupo: vLista[i].grupo, codigo: vLista[i].codigo })
    if (!vExiste) await parametroGeralRepositorio.incluir({ grupo: vLista[i].grupo, codigo: vLista[i].codigo, valor: vLista[i].valor, nome: vLista[i].nome, tipo: vLista[i].tipo })
  }
}

async function inicializarPerfil() {
  await mongoose.connection.db.createCollection('torrePerfil', {})

  const vExiste = await mongoose.connection.db.collection('torrePerfil').findOne({ _id: vTorrePerfilId });
  if (!vExiste) {
    await perfilRepositorio.incluir(
      {
        _id: vTorrePerfilId,
        status: true,
        nome: 'perfil teste TA',
        descricao: 'testeAutomatizado',
        log: {
          dataInclusao: '2020-02-12T14:07:50.802Z',
          usuarioInclusao: 'testeAutomatizado',
          dataAlteracao: '2020-02-12T14:07:53.838Z',
          usuarioAlteracao: 'testeAutomatizado',
        },
        permissoes: [
          {
            moduloId: vTorreModuloId,
            funcionalidadeId: vTorreFuncionalidadeId,
            permiteAlterar: true,
            permiteConsultar: true,
          },
        ]
        ,
      },
    )
  }

}

async function inicializarPerfilPermissao() {
  await mongoose.connection.db.createCollection('torrePerfilPermissao', {})
}

async function inicializarModulo() {
  const vExiste = await mongoose.connection.db.collection('torreModulo').findOne({ _id: vTorreModuloId })
  if (!vExiste) await moduloRepositorio.incluir({ _id: vTorreModuloId, nome: 'teste' })
}

async function inicializarFuncionalidade() {
  const vExiste = await mongoose.connection.db.collection('torreFuncionalidade').findOne({ _id: vTorreFuncionalidadeId })
  if (!vExiste) await funcionalidadeRepositorio.incluir({ _id: vTorreFuncionalidadeId, moduloId: vTorreModuloId, nome: 'teste' })
}

async function inicializarUsuario() {
  await mongoose.connection.db.createCollection('torreUsuario', {})

  const vPerfil = await mongoose.connection.db.collection('torrePerfil').findOne({ nome: 'Administrador' })

  const vExiste = await mongoose.connection.db.collection('torreUsuario').findOne({ login: 'Administrador' })
  if (!vExiste) {
    await usuarioRepositorio.incluir({
      nome: 'Administrador do Sistema',
      login: 'Administrador',
      senha: '$2a$10$Q01lEZ2eVAakjs/s6xZWS.RoGLvvdGMhP2Stl7ejveA7js.gH5i4m',
      email: 'admin@cuboconnect.com.br',
      celular: '123123123213',
      telefone: '123123123213',
      cpf: '123123123213',
      ehCliente: false,
      sexo: 'M',
      status: true,
      dataNascimento: '1994-11-05T13:15:30.000Z',
      uuidConfirmacao: '50411b55-64a1-4479-ab2a-787ed17ea377',
      dataConfirmacao: '2020-03-04T14:37:56.170Z',
      perfilId: vPerfil._id,
      permissoes: [
        {
          moduloId: vTorreModuloId,
          funcionalidadeId: vTorreFuncionalidadeId,
          permiteAlterar: true,
          permiteConsultar: true,
        },
      ],
      empresas: [
        {
          hubEmpresaId: 1,
          filiais: [
            {
              hubFilialId: 1,
            },
          ],
        },
      ],
    })
  }
}

async function inicializarPoligonoTipo() {
  const vListaTipoPoligono = [
    { descricao: 'Área de Risco' },
    { descricao: 'Ponto de Controle' },
    { descricao: 'Operacional' },
    { descricao: 'Fiscalização' },
    { descricao: 'Serviços' },
    { descricao: 'Cliente' },
    { descricao: 'Parada Autorizada' },
    { descricao: 'Embarcador' },
    { descricao: 'Coleta ou Entrega' },
    { descricao: 'Aduana' },
    { descricao: 'Centro de Distribuição' },
    { descricao: 'Check Point de Rotas (Balizas)' },
    { descricao: 'Área de carga' },
    { descricao: 'Área de descarga' },
    { descricao: 'Descanso' }]

  for (let i = 0; i < vListaTipoPoligono.length; i += 1) {
    const vExiste = await mongoose.connection.db.collection('torrePoligonoTipo').findOne({ descricao: vListaTipoPoligono[i].descricao })
    if (!vExiste) await poligonoTipoRepositorio.incluir({ codigo: vListaTipoPoligono[i].codigo, descricao: vListaTipoPoligono[i].descricao })
  }
}

async function inicializarParceiroClassificacao() {
  const vListaParceiroClassificacao = [
    { identificacaoClassificacao: 0, descricaoClassificacao: 'CLIENTE/FORNECEDOR' },
    { identificacaoClassificacao: 1, descricaoClassificacao: 'CLIENTE' },
    { identificacaoClassificacao: 2, descricaoClassificacao: 'FORNECEDOR' },
    { identificacaoClassificacao: 3, descricaoClassificacao: 'CARRETEIRO' },
    { identificacaoClassificacao: 4, descricaoClassificacao: 'AVULSO' },
    { identificacaoClassificacao: 5, descricaoClassificacao: 'FUNCIONARIO' },
    { identificacaoClassificacao: 6, descricaoClassificacao: 'IMPOSTO' },
    { identificacaoClassificacao: 7, descricaoClassificacao: 'FINANCIAMENTO' },
    { identificacaoClassificacao: 8, descricaoClassificacao: 'CLIENTE/CARRETEIRO' },
    { identificacaoClassificacao: 9, descricaoClassificacao: 'FORNECEDOR/CARRETEIRO' },
    { identificacaoClassificacao: 10, descricaoClassificacao: 'CLIENTE/FUNCIONARIO' },
    { identificacaoClassificacao: 11, descricaoClassificacao: 'CLIENTE/FORNECEDOR/CARRETEIRO' }
  ]

  for (let i = 0; i < vListaParceiroClassificacao.length; i += 1) {
    const vExiste = await mongoose.connection.db.collection('torreParceiroClassificacao').findOne({ identificacaoClassificacao: vListaParceiroClassificacao[i].identificacaoClassificacao });
    if (!vExiste) await parceiroClassificacaoRepositorio.incluir(vListaParceiroClassificacao[i])
  }
}

async function inicializarModulos() {
  const vListaModulo = [
    {
      nome: 'Gestão',
      funcionalidades: [
        { _id: '5e42ef89f59bb659d448f4c8', nome: 'Clientes' },
        { _id: '5e42ef89f59bb659d448f4c9', nome: 'Motoristas' },
        { _id: '5e42ef89f59bb659d448f4ca', nome: 'Veículos' },
        { _id: '5e42ef89f59bb659d448f4cb', nome: 'Regiões de Operação' },
        { _id: '5e42ef89f59bb659d448f4cc', nome: 'Rotas' },
        { _id: '5e45c540f215b9001c349389', nome: 'Polígonos' },
        { _id: '5e45c540f215b9001c34938b', nome: 'Perfis de Acesso' },
        { _id: '5e80dcf4d834046946a5a7c7', nome: 'Usuários' },
        { _id: '5e68e6a90c876969e0c79f9e', nome: 'Tipos de Ocorrência' },
        { _id: '5e68e6aa0c876969e0c79fa0', nome: 'Parâmetros' },
      ],
    },
    {
      nome: 'Programação/Monitoramento',
      funcionalidades: [
        { _id: '5e68e6ab0c876969e0c79fa4', nome: 'Acompanhamento de Pedidos' },
        { _id: '5e68e6ac0c876969e0c79fa8', nome: 'Disponibilidade de Veículos' },
        { _id: '5e68e6ac0c876969e0c79faa', nome: 'Disponibilidade de Motoristas' },
        { _id: '5e68e6ad0c876969e0c79fac', nome: 'Ocorrências' },
      ]
    },
    {
      nome: 'Performance',
      funcionalidades: [
        { _id: '5e967014f46f8e20b29ec1e3', nome: 'Pedidos' },
        { _id: '5e967002f46f8e20b29ec1e1', nome: 'Motoristas' },
        { _id: '5e96700af46f8e20b29ec1e2', nome: 'Veículos' },
        { _id: '5e964656f46f8e20b29ec1df', nome: 'Ocorrências' },
      ],
    },
  ]

  for (let i = 0; i < vListaModulo.length; i += 1) {
    const vExiste = await mongoose.connection.db.collection('torreModulo').findOne({ nome: vListaModulo[i].nome });


    let vModuloId;
    if (!vExiste) {
      const vModulo = (await moduloRepositorio.incluir({ nome: vListaModulo[i].nome })).dados;
      vModuloId = vModulo._id;
    }
    else {
      vModuloId = vExiste._id
    }


    const vListaFuncionalidade = vListaModulo[i].funcionalidades;

    for (let j = 0; j < vListaFuncionalidade.length; j++) {
      const vExisteF = await mongoose.connection.db.collection('torreFuncionalidade').findOne({ moduloId: vModuloId, nome: vListaFuncionalidade[j].nome });
      if (!vExisteF) await funcionalidadeRepositorio.incluir({ _id: vListaFuncionalidade[j]._id, moduloId: vModuloId, nome: vListaFuncionalidade[j].nome });
    }
  }
}

async function inicializarPerfis() {
  const vRetorno = await mongoose.connection.db.collection('torreFuncionalidade').find({}).toArray()
  const vFuncionalidadesModulos = vRetorno.map((registro) => ({
    funcionalidadeId: registro._id,
    moduloId: registro.moduloId,
    permiteAlterar: true,
    permiteConsultar: true,
  }))


  const vExiste = await mongoose.connection.db.collection('torrePerfil').findOne({ nome: 'Administrador' })
  if (!vExiste) {
    await perfilRepositorio.incluir(
      {
        status: true,
        nome: 'Administrador',
        descricao: 'Administradores de Sistema',
        log: {
          dataInclusao: '2020-02-12T14:07:50.802Z',
          usuarioInclusao: 'testeAutomatizado',
          dataAlteracao: '2020-02-12T14:07:53.838Z',
          usuarioAlteracao: 'testeAutomatizado',
        },
        permissoes: vFuncionalidadesModulos
        ,
      },
    )
  }
}

async function inicializarVeiculoTipoVinculo() {
  const vListaTipoVinculo = [
    { identificadorTipoVinculo: 'A', descricaoTipoVinculo: 'AGREGADO' },
    { identificadorTipoVinculo: 'C', descricaoTipoVinculo: 'CLIENTE' },
    { identificadorTipoVinculo: 'L', descricaoTipoVinculo: 'ALUGUEL' },
    { identificadorTipoVinculo: 'M', descricaoTipoVinculo: 'COMODATO' },
    { identificadorTipoVinculo: 'T', descricaoTipoVinculo: 'TERCEIRO' },
  ]

  for (let i = 0; i < vListaTipoVinculo.length; i++) {
    const vExiste = await mongoose.connection.db.collection('torreVeiculoTipoVinculo').findOne({ identificadorTipoVinculo: vListaTipoVinculo[i].identificadorTipoVinculo })
    if (!vExiste) await veiculoTipoVinculoRepositorio.incluir(vListaTipoVinculo[i], {})
  }
}


async function inicializarVeiculoClassificacao() {
  const vListaVeiculoClassificacao = [
    { codigoClassificacao: 12, descricaoClassificacao: 'BI-TREM CARGA SECA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 13, descricaoClassificacao: 'BI-TREM GRANELEIRO', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 15, descricaoClassificacao: 'BUG 20', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 16, descricaoClassificacao: 'BUG 40 VANDERLEIA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 17, descricaoClassificacao: 'BAU SIMPLES', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 18, descricaoClassificacao: 'CARGA SECA SIMPLES', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 19, descricaoClassificacao: 'GRANELEIRA SIMPLES', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 20, descricaoClassificacao: 'SIDER REBAIXADA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 21, descricaoClassificacao: 'SIDER RETA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 34, descricaoClassificacao: 'SIDER CANGURU', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 35, descricaoClassificacao: 'CARGA SECA VANDERLEIA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 36, descricaoClassificacao: 'SIDER VANDERLEIA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 37, descricaoClassificacao: 'CARGA SECA BOBINEIRA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 38, descricaoClassificacao: 'PRANCHA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 39, descricaoClassificacao: 'DOLLY', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 41, descricaoClassificacao: 'FLORESTAL', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 42, descricaoClassificacao: 'BUG 40 SIMPLES', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 49, descricaoClassificacao: 'BI-TREM SIDER', ativo: true, usaCombustivel: false },
    //{ codigoClassificacao: 54, descricaoClassificacao: 'BITRENZAO SIDER', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 61, descricaoClassificacao: 'CARGA SECA CANGURU', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 63, descricaoClassificacao: 'CARGA SECA REBAIXADA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 67, descricaoClassificacao: 'RODO-TREM CARGA SECA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 69, descricaoClassificacao: 'RODO-TREM SIDER', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 78, descricaoClassificacao: 'BITRENZAO SIDER', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 12, descricaoClassificacao: 'BI-TREM CARGA SECA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 23, descricaoClassificacao: 'SIDER DOUBLE DECK  ', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 62, descricaoClassificacao: 'BAU REBAIXADO', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 45, descricaoClassificacao: 'BAU VANDERLEIA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 53, descricaoClassificacao: 'BI-TREM BUG 40', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 77, descricaoClassificacao: 'GRANELEIRA CANGURU', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 65, descricaoClassificacao: 'GRANELEIRA VANDERLEIA', ativo: true, usaCombustivel: false },
    { codigoClassificacao: 68, descricaoClassificacao: 'RODO-TREM GRANELEIRO', ativo: true, usaCombustivel: false },

    { codigoClassificacao: 48, descricaoClassificacao: '3/4 GRANELEIRO', ativo: false, usaCombustivel: true },
    { codigoClassificacao: 58, descricaoClassificacao: 'BAU CANGURU', ativo: false, usaCombustivel: true },
    { codigoClassificacao: 52, descricaoClassificacao: 'BI-TRUCK GRANELEIRO', ativo: false, usaCombustivel: true },
    { codigoClassificacao: 76, descricaoClassificacao: 'VUC SIDER', ativo: false, usaCombustivel: true },
    { codigoClassificacao: 9,  descricaoClassificacao: 'CAVALO TOCO 4X2', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 10, descricaoClassificacao: 'CAVALO TRUCADO 6X2', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 11, descricaoClassificacao: 'CAVALO TRUCADO 6X4', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 14, descricaoClassificacao: 'BI-TRUCK CARGA SECA', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 24, descricaoClassificacao: '3/4 SIDER', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 26, descricaoClassificacao: 'TOCO BAU', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 27, descricaoClassificacao: 'TOCO CARGA SECA', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 28, descricaoClassificacao: 'TOCO SIDER', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 29, descricaoClassificacao: 'TRUCK BAU', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 30, descricaoClassificacao: 'TRUCK CARGA SECA', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 31, descricaoClassificacao: 'TRUCK SIDER', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 32, descricaoClassificacao: 'UTILITARIO', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 33, descricaoClassificacao: 'VAN', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 43, descricaoClassificacao: '3/4 CARGA SECA', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 44, descricaoClassificacao: '3/4 BAU', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 46, descricaoClassificacao: 'BI-TRUCK SIDER', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 47, descricaoClassificacao: 'BI-TRUCK BAU', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 72, descricaoClassificacao: 'TOCO GRANELEIRO', ativo: true, usaCombustivel: true },
    { codigoClassificacao: 73, descricaoClassificacao: 'TRUCK GRANELEIRO', ativo: true, usaCombustivel: true }
  ]

  for (let i = 0; i < vListaVeiculoClassificacao.length; i += 1) {
    const vExiste = await mongoose.connection.db.collection('torreVeiculoClassificacao').findOne({ codigoClassificacao: vListaVeiculoClassificacao[i].codigoClassificacao })
    if (!vExiste) await veiculoClassificacaoRepositorio.incluir(vListaVeiculoClassificacao[i], {})
  }
}

async function inicializarVeiculoSituacao() {
  const vListaVeiculoSituacao = [
    { identificadorSituacaoVeiculo: 1, descricaoSituacaoVeiculo: 'ATIVO' },
    { identificadorSituacaoVeiculo: 2, descricaoSituacaoVeiculo: 'BAIXADO' },
    { identificadorSituacaoVeiculo: 3, descricaoSituacaoVeiculo: 'INATIVO' },
  ]

  for (let i = 0; i < vListaVeiculoSituacao.length; i += 1) {
    const vExiste = (await veiculoSituacaoRepositorio.obterPelaDescricao(vListaVeiculoSituacao[i].descricaoSituacaoVeiculo)).dados
    if (!vExiste) await veiculoSituacaoRepositorio.incluir(vListaVeiculoSituacao[i], {})
  }
}

async function inicializarPedidoStatus() {
  const vListaPedidoStatus = [
    { descricao: 'Novo', codigo: 1 },
    { descricao: 'Com Alocação', codigo: 2 },
    { descricao: 'Cancelado', codigo: 3 },
    { descricao: 'Em Viagem', codigo: 4 },
    { descricao: 'Viagem Finalizada', codigo: 5 },
    { descricao: 'Bloqueado Ger. Risco', codigo: 6 },
    { descricao: 'Baixado', codigo: 7 },
  ];

  for (let i = 0; i < vListaPedidoStatus.length; i += 1) {
    const vExiste = await pedidoStatusRepositorio.obterPelaDescricao(vListaPedidoStatus[i].descricao)
    if (!vExiste.dados) await pedidoStatusRepositorio.incluir({ codigo: vListaPedidoStatus[i].codigo, descricao: vListaPedidoStatus[i].descricao }, {})
  }
}

async function inicializarDadosTeste() {
  await mongoose.connection.db.collection('torrePerfil').deleteOne({ _id: vTorrePerfilId })
  await mongoose.connection.db.collection('torreUsuario').deleteOne({ _id: vTorreUsuarioId })
  await mongoose.connection.db.collection('torreVeiculoCustoFixo').deleteOne({ _id: vTorreVeiculoCustoFixoId })

  await mongoose.connection.db.collection('torreNotificacao').deleteOne({ titulo: 'tituloTesteNotificacao' })
  await mongoose.connection.db.collection('torreParceiroCustoOperacao').deleteOne({ hubParceiroId: '999999' })
  await mongoose.connection.db.collection('torreParceiroTempoMovimento').deleteOne({ hubParceiroId: '999999' })
  await mongoose.connection.db.collection('torreParceiroTempoLimite').deleteOne({ hubParceiroId: '999999' })
  await mongoose.connection.db.collection('torreUsuario').deleteOne({ login: 'loginTA' })
  await mongoose.connection.db.collection('torreFuncionalidade').deleteOne({ nome: 'Funcionalidade Teste Automatizado' })
  await mongoose.connection.db.collection('torreModulo').deleteOne({ nome: 'Módulo Teste Automatizado' })
  await mongoose.connection.db.collection('torrePerfil').deleteOne({ nome: 'perfilTA' })
  await mongoose.connection.db.collection('torreMotorista').deleteOne({ codigoMotorista: '10' })
  await mongoose.connection.db.collection('torreRotaDadoComplementar').deleteOne({ hubRotaId: 1, hubVeiculoClassificacaoId: 1 })
  await mongoose.connection.db.collection('torreRegiaoOperacao').deleteOne({ regiaoOperacao: 'Diadema TA' })
  await mongoose.connection.db.collection('torreRegiaoOperacao').deleteOne({ regiaoOperacao: 'São Bernado TA' })
  await mongoose.connection.db.collection('torrePoligonoTipo').deleteOne({ descricao: 'Tipo Poligono TA' })
  await mongoose.connection.db.collection('torreVeiculoCustoVariavel').deleteOne({ codigoVeiculo: 'AAA1111' })
  await mongoose.connection.db.collection('torreVeiculoCustoFixo').deleteOne({ codigoVeiculo: 'XXXXXXX' })


  await mongoose.connection.db.collection('torrePerfil').insertOne(
    {
      _id: vTorrePerfilId,
      status: true,
      nome: 'perfil teste TA',
      descricao: 'testeAutomatizado',
      log: {
        dataInclusao: '2020-02-12T14:07:50.802Z',
        usuarioInclusao: 'testeAutomatizado',
        dataAlteracao: '2020-02-12T14:07:53.838Z',
        usuarioAlteracao: 'testeAutomatizado',
      },
    },
  )

  const vExiste = await mongoose.connection.db.collection('torreUsuario').findOne({ _id: vTorreUsuarioId })
  if (!vExiste) {
    await usuarioRepositorio.incluir({
      _id: vTorreUsuarioId,
      nome: 'usuario Teste',
      login: 'uTesteAutomatizado',
      senha: '$2a$10$Q01lEZ2eVAakjs/s6xZWS.RoGLvvdGMhP2Stl7ejveA7js.gH5i4m',
      email: 'utesteAutomatizado@cuboconnect.com.br',
      celular: '123123123213',
      telefone: '123123123213',
      cpf: '123123123213',
      ehCliente: false,
      sexo: 'M',
      status: true,
      dataNascimento: '1994-11-05T13:15:30.000Z',
      uuidConfirmacao: '50411b55-64a1-4479-ab2a-787ed17ea377',
      dataConfirmacao: '2020-03-04T14:37:56.170Z',
      perfilId: vTorrePerfilId,
      permissoes: [
        {
          moduloId: vTorreModuloId,
          funcionalidadeId: vTorreFuncionalidadeId,
          permiteAlterar: true,
          permiteConsultar: true,
        },
      ],
      empresas: [
        {
          hubEmpresaId: 1,
          filiais: [
            {
              hubFilialId: 1,
            },
          ],
        },
      ],
    })
  }

  await mongoose.connection.db.collection('torreVeiculoCustoFixo').insertOne({
    _id: vTorreVeiculoCustoFixoId,
    codigoVeiculo: 'AAA1111',
    vigenciaCustoFixo: '2019-02-11T18:16:41.279Z',
    custoReposicaoFrota: 10,
    custoRemuneracaoFrota: 10,
    custoMotoristaTotal: 10,
    custoFixoTotal: 10,
    custoDocumentosImpostos: 10,
    custoRastreador: 10,
    custoSeguro: 10,
    log: {
      dataInclusao: '2020-02-11T20:23:48.495Z',
      usuarioInclusao: 'ctesteAutomatizado',
      dataAlteracao: '2020-02-11T20:23:48.495Z',
      usuarioAlteracao: 'ctesteAutomatizado',
    },
  })

  return { ok: true }
}

function obterConteudoArquivo(pArquivo) {
  const vArquivo = fs.readFileSync(`${__dirname}\\arquivos\\${pArquivo}`, { encoding: 'utf-8' })
  return JSON.parse(vArquivo)
}

async function processarItem(item) {
  const vArquivoConteudo = obterConteudoArquivo(item.arquivo)
  // eslint-disable-next-line global-require
  //const vServico = require(`../${item.servico}`)
  //import('teste').then(() => {})
  // console.log(vServico.incluir({}))
  // vServico().incluir(vArquivoConteudo)
  // console.log(vArquivoConteudo)
}

async function processar() {
  await inicializarOcorrenciaTipo()
  //const lista = []
  //lista.push({ servico: 'ocorrenciaTipoServico', arquivo: 'ocorrenciaTipo.json' })

  //for (let i = 0; i < lista.length; i += 1) {
  //  processarItem(lista[i])
  // }
}

async function inicializarOcorrenciaTipo() {
  const vArquivoConteudo = obterConteudoArquivo('ocorrenciaTipo.json')

  for (let i = 0; i < vArquivoConteudo.length; i += 1) {
    const req = { body: vArquivoConteudo[i] }
    const vExiste = (await ocorrenciaTipoServico.obterPorCodigo(req.body.codigo)).dados
    if (!vExiste) await ocorrenciaTipoServico.incluir(req)
    else await ocorrenciaTipoServico.alterarPorCodigo(req.body.codigo, req.body)
  }

}

async function inicializarTabelas() {
  //  await inicializarParametroGeral()
  //  await inicializarModulo()
  //  await inicializarFuncionalidade()
  //  await inicializarModulos()
  //  await inicializarPerfil()
  //  await inicializarPerfis()
  //  await inicializarPerfilPermissao()
  //  await inicializarPoligonoTipo()
  //  await inicializarUsuario()
  //  await inicializarParceiroClassificacao()
  //  await inicializarVeiculoTipoVinculo()
   await inicializarVeiculoClassificacao()
  //  await inicializarVeiculoSituacao()
  //  await inicializarPedidoStatus()
}

const inicializarServico = {
  processar: () => processar(),
  inicializarTabelas: () => inicializarTabelas(),
  inicializarDadosTeste: () => inicializarDadosTeste(),
}

export default inicializarServico
