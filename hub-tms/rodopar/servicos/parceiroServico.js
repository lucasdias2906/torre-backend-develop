import dml from '../funcoes/dml';
import sql from './parceiroSQL';

async function listaParceiros(req) {
  const vParams = req.query;
  let vFiltro = '';
  let vOrdenacao = '';


  if (vParams.codigoParceiroComercial) vFiltro += ` AND CLI.CODCLIFOR = ${vParams.codigoParceiroComercial}`;
  if (vParams.nomeRazaoSocial) vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomeRazaoSocial}%'`;
  if (vParams.numeroCnpj) vFiltro += ` AND (CLI.CODCGC = '${vParams.numeroCnpj}' or CLI.CODCGC = '${vParams.numeroCnpj}.replace(/[^\d]+/g,'')')`;
  if (vParams.identificacaoClassificacao) vFiltro += ` AND (CLI.CLASSI = '${vParams.identificacaoClassificacao}')`;
  if (vParams.parceiros) vFiltro += ` AND (CLI.CODCLIFOR IN (${vParams.parceiros}))`;

  vOrdenacao = '';
  if (vParams.ordenacao === 'codigoparceirocomercial') vOrdenacao += ' CLI.CODCLIFOR';
  else if (vParams.ordenacao === 'nomerazaosocial') vOrdenacao += ' CLI.RAZSOC';
  else if (vParams.ordenacao === 'numerocnpj') vOrdenacao += 'CLI.CODCGC';
  else if (vParams.ordenacao === 'identificacaoclassificacao') vOrdenacao += 'CLI.CLASSI';
  else vOrdenacao += ' CLI.CODCLIFOR';

  const resultSql = await dml.executarSQLListar(
    vParams,
    sql.sqlparceiroComercialDetalhes(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao,
  );

  const { totalRegistros, totalRegistrosPagina, dados } = resultSql;

  const result = dados.map((elem) => ({
    codigoParceiroComercial: elem.parceiro.codigoParceiroComercial,
    numeroCNPJ: elem.parceiro.numeroCNPJ,
    nomeRazaoSocial: elem.parceiro.nomeRazaoSocial,
    identificacaoClassificacao: elem.parceiro.identificacaoClassificacao,
    descricaoClassificacao: elem.parceiro.descricaoClassificacao,
    dataAlteracao: elem.log.dataAlteracao,
    usuarioAlteracao: elem.log.usuarioAlteracao,
    dataInclusao: elem.log.dataInclusao,
    usuarioInclusao: elem.log.usuarioInclusao,

  }), 0);

  return {
    totalRegistros,
    totalRegistrosPagina,
    dados: result,
  };
}

async function listarDetalhes(pCodigoParceiro, req) {
  const vParams = req.query;

  let vFiltro = '';
  let vOrdenacao = '';

  if (pCodigoParceiro) vFiltro += ` AND CLI.CODCLIFOR = ${pCodigoParceiro}`;
  if (vParams.codigoParceiroComercial) vFiltro += ` AND CLI.CODCLIFOR = ${vParams.codigoParceiroComercial}`;
  if (vParams.nomeRazaoSocial) vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomeRazaoSocial}%'`;
  if (vParams.numeroCnpj) vFiltro += ` AND (CLI.CODCGC = '${vParams.numeroCnpj}' or CLI.CODCGC = '${vParams.numeroCnpj}.replace(/[^\d]+/g,'')')`;

  vOrdenacao = '';
  if (vParams.ordenacao === 'codigoParceiroComercial') vOrdenacao += ' CLI.CODCLIFOR';
  else if (vParams.ordenacao === 'nomeRazaoSocial') vOrdenacao += ' CLI.RAZSOC';
  else if (vParams.ordenacao === 'numeroCnpj') vOrdenacao += 'CLI.CODCGC';
  else vOrdenacao += ' CLI.CODCLIFOR';

  const resultSql = await dml.executarSQLListar(
    vParams,
    sql.sqlparceiroComercialDetalhes(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao,
  );

  const { dados } = resultSql;

  const result = dados.map((elem) => ({
    parceiro: {
      codigoParceiroComercial: elem.parceiro.codigoParceiroComercial,
      identificacaoClassificacao:
       elem.parceiro.identificacaoClassificacao,
      descricaoClassificacao: elem.parceiro.descricaoClassificacao,
      identificacaoTipoPessoa: elem.parceiro.identificacaoTipoPessoa,
      descricacaoTipoPessoa: elem.parceiro.descricacaoTipoPessoa,
      identificacaoSituacaoParceiroComercial:
        elem.parceiro.identificacaoSituacaoParceiroComercial,
      descricaoSituacaoParceiroComercial:
        elem.parceiro.descricaoSituacaoParceiroComercial,
      codigoGrupo: elem.parceiro.codigoGrupo,
      codigoEmpresa: elem.parceiro.codigoEmpresa,
      descricaoEmpresa: elem.parceiro.descricaoEmpresa,
      codigoFilial: elem.parceiro.codigoFilial,
      numeroCNPJ: elem.parceiro.numeroCNPJ,
      nomeRazaoSocial: elem.parceiro.nomeRazaoSocial,
      nomeAbreviado: elem.parceiro.nomeAbreviado,
      numeroIE: elem.parceiro.numeroIE,
      numeroCEP: elem.parceiro.numeroCEP,
      tipoLogradouro: elem.parceiro.tipoLogradouro,
      nomeEndereco: elem.parceiro.nomeEndereco,
      numeroEndereco: elem.parceiro.numeroEndereco,
      nomeComplemento: elem.parceiro.nomeComplemento,
      nomeReferenciaEndereco: elem.parceiro.nomeReferenciaEndereco,
      numeroDDDTelefone1: elem.parceiro.numeroDDDTelefone1,
      numeroTelefone: elem.parceiro.numeroTelefone,
      numeroDDDTelefone2: elem.parceiro.numeroDDDTelefone2,
      numeroTelefone2: elem.parceiro.numeroTelefone2,
      nomeBairro: elem.parceiro.nomeBairro,
      codigoMunicipio: elem.parceiro.codigoMunicipio,
      nomeMuncipio: elem.parceiro.nomeMuncipio,
      siglaUF: elem.parceiro.siglaUF,
    },
    seguro: {
      codigoSeguro: elem.padroes.codigoSeguro,
      descricaoSeguro: elem.padroes.descricaoSeguro,
      codigoSeguroRCFDC: elem.padroes.codigoSeguroRCFDC,
      descricaoSeSeguroRCFDC: elem.padroes.descricaoSeSeguroRCFDC,
    },
    parametros: {
      identificacaoOperacaoSegunda:
        elem.parametros.identificacaoOperacaoSegundaFeira === 'S',
      identificacaoOperacaoTercaFeira:
        elem.parametros.identificacaoOperacaoTercaFeira === 'S',
      identificacaoOperacaoQuartaFeira:
        elem.parametros.identificacaoOperacaoQuartaFeira === 'S',
      identificacaoOperacaoQuintaFeira:
        elem.parametros.identificacaoOperacaoQuintaFeira === 'S',
      identificacaoOperacaoSextaFeira:
        elem.parametros.identificacaoOperacaoSextaFeira === 'S',
      identificacaoOperacaoSabado:
        elem.parametros.identificacaoOperacaoSabado === 'S',
      identificacaoOperacaoDomingo:
        elem.parametros.identificacaoOperacaoDomingo === 'S',
      horaAtendimentoEntreINI:
        elem.parametros.horaAtendimentoEntreINI,
      horaAtendimentoEntreFIM:
        elem.parametros.horaAtendimentoEntreFIM,
      horaNaoAtendimentoEntreINI:
        elem.parametros.horaNaoAtendimentoEntreINI,
      horaNaoAntedimentoEntreFIM:
        elem.parametros.horaNaoAntedimentoEntreFIM,
    },
    log: {
      dataAlteracao: elem.log.dataAlteracao,
      usuarioAlteracao: elem.log.usuarioAlteracao,
      dataInclusao: elem.log.dataInclusao,
      usuarioInclusao: elem.log.usuarioInclusao,
    },

  }), 0);

  return { dados: result[0] };
}

async function listarContato(pCodigoParceiro, req) {
  let vFiltro = '';
  let vOrdenacao = '';
  const vParams = req.query;

  if (pCodigoParceiro) vFiltro += ` AND CLI.CODCLIFOR = ${pCodigoParceiro}`;

  vOrdenacao = '';
  vOrdenacao += ' CTC.NOMECT';

  return dml.executarSQLListar(
    [],
    sql.sqlcontatoParceiroListar(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao,
  );
}

async function obterContato(pCodigoParceiro, pCodigoContato, req) {
  const vParams = req.query;
  return dml.executarSQLObter(sql.sqlcontatoParceiroObter(vParams.permissaoFiliais), pCodigoContato);
}

const parceiroComercialServico = {
  listaParceiros: (req) => listaParceiros(req),
  listarDetalhes: (pCodigoParceiro, req) => listarDetalhes(pCodigoParceiro, req),
  listarContato: (pCodigoParceiro, req) => listarContato(pCodigoParceiro, req),
  obterContato: (pCodigoParceiro, pContatoId, req) => obterContato(pCodigoParceiro, pContatoId, req),
};

export default parceiroComercialServico;
