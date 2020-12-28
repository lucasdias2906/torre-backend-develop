const sqlMotoristaListar = (pPermissaoFiliais) => `
SELECT
       @@ORDENACAOLINHA@@
       MOT.CODMOT codigoMotorista,
       MOT.NOMMOT nomeMotorista,
       MOT.NUMCPF numeroCPF,
       CMO.CODCMO codigoClassificacao,
       CMO.DESCRI descricaoClassificacao,
      (SELECT GR.SITUAC FROM RODGRI GR
       WHERE GR.CODMOT  = MOT.CODMOT
           AND GR.ID_CODGRI IN (SELECT
                            MAX(GRI.ID_CODGRI)
                     FROM RODGRI GRI
                     WHERE GRI.CODMOT = MOT.CODMOT)
       ) AS identificacaoStatusGestoraRisco,
   MOT.SITUAC codigoSituacao,
  CASE WHEN MOT.SITUAC = 'A' THEN 'ATIVO'
       WHEN MOT.SITUAC = 'I' THEN 'INATIVO'
       WHEN MOT.SITUAC = 'L' THEN 'AGUARDANDO LIBERACAO'
  END descricaoSituacao
 FROM
      RODMOT MOT
 JOIN RODCMO CMO ON (MOT.CODCMO = CMO.CODCMO)
 JOIN RODFIL FIL ON FIL.CODFIL = MOT.CODFIL
 WHERE (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')  -- Filtro multi empresa de acordo com os acessos do usuario logado
 @@FILTRO@@
`

const sqlMotoristaStatusGestoraRisco = `SELECT
@@ORDENACAOLINHA@@
identificacaoStatusGestoraRisco,
"descricaoStatusGestorRisco"
FROM
(
SELECT DISTINCT GRI.SITUAC identificacaoStatusGestoraRisco,
CASE WHEN GRI.SITUAC = 'INAP' THEN 'INAPTO'
WHEN GRI.SITUAC = 'APTO' THEN 'APTO'
WHEN GRI.SITUAC = 'ALPV' THEN 'AGUARDANDO LIB. PROX. VIAGEM'
WHEN GRI.SITUAC = 'APTR' THEN 'APTO, COM RESTRIÇÕES'
WHEN GRI.SITUAC = 'INAI' THEN 'INAPTO, INSUFICENCIA DE DADOS'
END "descricaoStatusGestorRisco"
FROM RODGRI GRI
) GRI`

const sqlMotoristaSituacao = `
SELECT
@@ORDENACAOLINHA@@
codigoSituacao,
descricaoSituacao
FROM
(
SELECT 'A' codigoSituacao, 'ATIVO'  descricaoSituacao
UNION
SELECT 'I' codigoSituacao, 'INATIVO'  descricaoSituacao
UNION
SELECT 'L' codigoSituacao, 'AGUARDANDO LIBERACAO'  descricaoSituacao
) X `

const sqlMotoristaObterDadosPessoais = (pPermissaoFiliais) => `SELECT
            -- Aba Dados pessoais
            MOT.CODMOT "documentos.codigoMotorista",
            MOT.SITUAC "documentos.identificacaoStatus",
            CASE WHEN MOT.SITUAC = 'A' THEN 'ATIVO'
 WHEN MOT.SITUAC = 'I' THEN 'INATIVO'
     WHEN MOT.SITUAC = 'L' THEN 'AGUARDANDO LIBERACAO'
 END "documentos.descricaoStatus",
 --
 (SELECT
 GR.SITUAC
 FROM RODGRI GR
 WHERE GR.CODMOT  = MOT.CODMOT
 AND GR.ID_CODGRI IN (SELECT
                     MAX(GRI.ID_CODGRI)
                     FROM RODGRI GRI
                     WHERE GRI.CODMOT = MOT.CODMOT)
 ) AS "documentos.identificacaoStatusGestoraRisco",
 MOT.CODCMO "documentos.codigoClassificacao",
 CMO.DESCRI "documentos.descricaoClassificacao",
 MOT.TIPMOT "documentos.tipoMotorista",
 CASE WHEN MOT.TIPMOT = 'M' THEN 'MOTORISTA'
     WHEN MOT.TIPMOT = 'F' THEN 'FUNCIONARIO INTERNO'
     WHEN MOT.TIPMOT = 'O' THEN 'OUTROS CONDUTORES'
 END "documentos.descricaoTipoMotorista",
 MOT.CUIRUI "documentos.numeroCUIT",
 MOT.NUMPIS "documentos.numeroPIS",
 MOT.NUMCPF "documentos.numeroCPF",
 MOT.NOMMOT "documentos.nomeMotorista",
 MOT.NOMEAB "documentos.nomeAbreviado",
 MOT.NATURA "documentos.nomeNaturalidade",
 MOT.NACION "documentos.nomeNacionalidade",
 MOT.SEXO "documentos.identificacaoSexo",
 CASE WHEN MOT.SEXO = 'M' THEN 'MASCULINO'
     WHEN MOT.SEXO = 'F' THEN 'FEMININIO'
 END "documentos.descricaoSexo",
 MOT.DTNASC "documentos.dataNascimento",
 MOT.NUMTEL "documentos.numeroTelefone",
 MOT.TELCEL "documentos.numeroCelular",
 MOT.OPETEL "documentos.codigoOperadora",
 CASE WHEN MOT.OPETEL = '1' THEN 'AMAZÔNIA CELULAR'
     WHEN MOT.OPETEL = '4' THEN 'CLARO'
     WHEN MOT.OPETEL = '6' THEN 'OI'
     WHEN MOT.OPETEL = '8' THEN 'TIM'
     WHEN MOT.OPETEL = '9' THEN 'VIVO'
     WHEN MOT.OPETEL = '10' THEN 'NEXTEL'
 END "documentos.descricaoOPERADORA",
 MOT.FUNCAO "documentos.descricaoFuncao",
 MOT.NEXTEL "documentos.numeroNextel",
 MOT.DATCAD "documentos.dataCadastro",
 --
 -- Aba Localização
 --
 MOT.CODFIL "localizacao.codigoFilial",
 MOT.NUMCEP "localizacao.numeroCEP",
 MOT.TIPLOG "localizacao.tipoLogradouro",
 MOT.ENDERE "localizacao.nomeEndereco",
 MOT.NUMERO "localizacao.numeroLogradouro",
 MOT.COMPLE "localizacao.nomeComplemento",
 MOT.BAIRRO "localizacao.nomeBairro",
 MOT.CODMUN "localizacao.codigoMunicipio",
 MUN.DESCRI "localizacao.descricaoMunicipio",
 MOT.ESTADO "localizacao.siglaUF",

 MOT.CODCUS "custo.codigoCentroCusto",
 CUS.DESCRI "custo.descricaoCentroCusto",
 MOT.CODUNN "custo.codigoUnidadeNegocio",
 UNN.DESCRI "custo.descricaoUnidadeNegocio",
 MOT.CODCGA "custo.codigoCentroGasto",
 CGA.DESCRI "custo.descricaoCentroGasto",

 MOT.DATATU 'log.dataAlteracao',
 MOT.USUATU 'log.usuarioAlteracao',
 MOT.DATINC 'log.dataInclusao',
 MOT.USUINC 'log.usuarioInclusao'
                                         FROM
RODMOT MOT -- cad. de motorista
LEFT JOIN RODUNN UNN on MOT.CODUNN = UNN.CODUNN -- cad. unidade de negocio
LEFT JOIN RODFIL FILU ON FILU.CODFIL = UNN.CODFIL -- cad. de filial (com base na unidade de negocio)
LEFT JOIN RODPLA PLA on MOT.CODCON = PLA.CODCON AND PLA.CODEMP = FILU.CODEMP -- cad. de conta contabil (Filtro de empresa c/ a unidade de negocio)
LEFT JOIN RODCMO CMO on MOT.CODCMO = CMO.CODCMO -- cad. classificacao motorista
LEFT JOIN RODMUN MUN on MOT.CODMUN = MUN.CODMUN -- cad. unidade de municipio (endereco do motorista)
LEFT JOIN RODMUN MUNR on MOT.CIDARG = MUNR.CODMUN -- cad. unidade de municipio (RG)
LEFT JOIN RODMUN MUNC on MOT.CCIDAD = MUNC.CODMUN -- cad. unidade de municipio (carteira profissional)
LEFT JOIN RODMUN MUNP on MOT.MUNPRO = MUNP.CODMUN -- cad. unidade de municipio (prontuario)
LEFT JOIN RODMUN MUNH on MOT.CARTCI = MUNH.CODMUN -- cad. unidade de municipio (CNH)
LEFT JOIN RODCUS CUS on MOT.CODCUS = CUS.CODCUS -- cad. centro de custos
LEFT JOIN RODCGA CGA on MOT.CODCGA = CGA.CODCGA -- cad. centro de gastos
LEFT JOIN RODBCO BCO on MOT.CODBCO = BCO.CODBCO -- cad. de bancos
LEFT JOIN RODCOM COM on MOT.CODCOM = COM.CODCOM -- cad. de comissão
     JOIN RODFIL FIL ON FIL.CODFIL = MOT.CODFIL -- cad. de filial
     JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
--
LEFT JOIN RODCLI CLI on MOT.CODCLIFOR = CLI.CODCLIFOR -- cad. parceiro comercial (Sbustituir pelo API de parceiro comercial)
LEFT JOIN RODVEI VEI on VEI.CODVEI = MOT.PLACAV -- cad. marca do veículo (Sbustituir pelo API de veiculo)
LEFT JOIN RODMCV MCV on VEI.CODMCV = MCV.CODMCV -- cad. marca do veículo (Sbustituir pelo API de veiculo)
LEFT JOIN RODMDV MDV on VEI.CODMDV = MDV.CODMDV -- cad. modelo do veículo (Sbustituir pelo API de veiculo)
WHERE (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')  -- Filtro multi empresa de acordo com os acessos do usuario logado
AND MOT.CODMOT = :pId`

const sqlMotoristaObterOutrasInformacoes = (pPermissaoFiliais) => `SELECT
--
-- Aba Outras informações
--
MOT.EMPREG "registro.identificacaoRegistrado",
MOT.DATADM "registro.dataAdmissao",
MOT.DESMOT "registro.identificacaoDesligamento",
MOT.GESTOR "registro.nomeGestor",
MOT.CODFIL "registro.codigoFilial",
FIL.RAZSOC "registro.nomeRazaoSocial",
FIL.NOMEAB "registro.nomeFantasia",
--
MOT.CODCLIFOR "registro.codigoProprietario",
CLI.RAZSOC "registro.nomeProprietario",
MOT.VEICFIX "registro.identificadorVeiculoFixo",
--
MOT.PLACAV "registro.identificacaoVeiculo",
MCV.DESCRI "registro.descricaoMarca",
MDV.DESCRI "registro.descricaoModelo",
--
MOT.CODCOM "registro.codigoComissao",
COM.DESCRI "registro.descricacaoComissao",
--
-- Aba Dados bancarios
--
MOT.CODBCO "dadosBancarios.codigoBancoContaCorrete",
BCO.DESCRI "dadosBancarios.nomeBanco",
MOT.CONTA "dadosBancarios.numeroContaCorrete",
MOT.AGENCI "dadosBancarios.numeroAgenciaContaCorrente",
MOT.TIPCTB "dadosBancarios.identificacaoTipoConta",
CASE WHEN MOT.TIPCTB = 'C' THEN 'CORRENTE'
WHEN MOT.TIPCTB = 'P' THEN 'POUPANCA'
WHEN MOT.TIPCTB = 'S' THEN 'SALARIO'
END "dadosBancarios.descricaoTipoConta",
MOT.CODFOL "dadosBancarios.codigoMatriculaFolha",
MOT.DESAAE "dadosBancarios.identificacaoDesconsideraAgrupamento",
MOT.CODCON "dadosBancarios.codigoContaContabil",
PLA.DESCRI "dadosBancarios.descricaoContaContabil",
MOT.DATATU 'log.dataAlteracao',
MOT.USUATU 'log.usuarioAlteracao',
MOT.DATINC 'log.dataInclusao',
MOT.USUINC 'log.usuarioInclusao'

FROM
     RODMOT MOT -- cad. de motorista
LEFT JOIN RODUNN UNN on MOT.CODUNN = UNN.CODUNN -- cad. unidade de negocio
LEFT JOIN RODFIL FILU ON FILU.CODFIL = UNN.CODFIL -- cad. de filial (com base na unidade de negocio)
LEFT JOIN RODPLA PLA on MOT.CODCON = PLA.CODCON AND PLA.CODEMP = FILU.CODEMP -- cad. de conta contabil (Filtro de empresa c/ a unidade de negocio)
LEFT JOIN RODCMO CMO on MOT.CODCMO = CMO.CODCMO -- cad. classificacao motorista
LEFT JOIN RODMUN MUN on MOT.CODMUN = MUN.CODMUN -- cad. unidade de municipio (endereco do motorista)
LEFT JOIN RODMUN MUNR on MOT.CIDARG = MUNR.CODMUN -- cad. unidade de municipio (RG)
LEFT JOIN RODMUN MUNC on MOT.CCIDAD = MUNC.CODMUN -- cad. unidade de municipio (carteira profissional)
LEFT JOIN RODMUN MUNP on MOT.MUNPRO = MUNP.CODMUN -- cad. unidade de municipio (prontuario)
LEFT JOIN RODMUN MUNH on MOT.CARTCI = MUNH.CODMUN -- cad. unidade de municipio (CNH)
LEFT JOIN RODCUS CUS on MOT.CODCUS = CUS.CODCUS -- cad. centro de custos
LEFT JOIN RODCGA CGA on MOT.CODCGA = CGA.CODCGA -- cad. centro de gastos
LEFT JOIN RODBCO BCO on MOT.CODBCO = BCO.CODBCO -- cad. de bancos
LEFT JOIN RODCOM COM on MOT.CODCOM = COM.CODCOM -- cad. de comissão
     JOIN RODFIL FIL ON FIL.CODFIL = MOT.CODFIL -- cad. de filial
     JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
--
LEFT JOIN RODCLI CLI on MOT.CODCLIFOR = CLI.CODCLIFOR -- cad. parceiro comercial (Sbustituir pelo API de parceiro comercial)
LEFT JOIN RODVEI VEI on VEI.CODVEI = MOT.PLACAV -- cad. marca do veículo (Sbustituir pelo API de veiculo)
LEFT JOIN RODMCV MCV on VEI.CODMCV = MCV.CODMCV -- cad. marca do veículo (Sbustituir pelo API de veiculo)
LEFT JOIN RODMDV MDV on VEI.CODMDV = MDV.CODMDV -- cad. modelo do veículo (Sbustituir pelo API de veiculo)
WHERE (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')  -- Filtro multi empresa de acordo com os acessos do usuario logado
AND MOT.CODMOT = :pId`

const sqlMotoristaObterDocumentacao = (pPermissaoFiliais) => `
SELECT
--
-- Aba Documentação
--
MOT.NUMERG "rg.numeroRG",
MOT.DATARG "rg.dataRG",
MOT.CIDARG "rg.codigoCidadeRG",
MUNR.DESCRI "rg.descricaoMuncipioRG",
MUNR.ESTADO "rg.siglaUfRG",
MOT.ORGEXP "rg.nomeOrgaoExpedidoRG",
--
MOT.CPROFI "carteiraProfissional.numeroCarteiraProfissional",
MOT.CPROSE "carteiraProfissional.serieCarteiraProfissional",
MOT.CCIDAD "carteiraProfissional.codigoCidadeCarteiraProfissional",
MUNC.DESCRI "carteiraProfissional.nomeMunicipioCarteiraProfissional",
MUNC.ESTADO "carteiraProfissional.siglaUfCarteiraProfissional",
--
MOT.NUMPRO "habilitacao.numeroProntuario",
MOT.DATPRO "habilitacao.dataProntuario",
MOT.MUNPRO "habilitacao.codigoCidadeProntuario",
MUNP.DESCRI "habilitacao.nomeMuncipioProntuario",
MUNP.ESTADO "habilitacao.siglaUfProntuario",
--
MOT.CARTHA "habilitacao.numeroCNH",
MOT.CARTDT "habilitacao.dataCNH",
MOT.CARTCI "habilitacao.codigoCidadeCNH",
MUNH.DESCRI "habilitacao.nomeMunicipioCNH",
MUNH.ESTADO "habilitacao.siglaUfCNH",
MOT.CATECH "habilitacao.categoriaCNH",
MOT.VENCHA "habilitacao.dataVencimentoCNH",
MOT.CODIFI "habilitacao.codigoCodificadorCNH",
--
MOT.DATINC "log.dataInclusao",
MOT.USUINC "log.usuarioInclusao",
MOT.DATATU "log.dataAlteracao",
MOT.USUATU "log.usuarioAlteracao"

FROM RODMOT MOT -- cad. de motorista
LEFT OUTER JOIN RODUNN UNN on MOT.CODUNN = UNN.CODUNN -- cad. unidade de negocio
LEFT OUTER JOIN RODFIL FILU ON FILU.CODFIL = UNN.CODFIL -- cad. de filial (com base na unidade de negocio)
LEFT OUTER JOIN RODPLA PLA on MOT.CODCON = PLA.CODCON AND PLA.CODEMP = FILU.CODEMP -- cad. de conta contabil (Filtro de empresa c/ a unidade de negocio)
LEFT OUTER JOIN RODCMO CMO on MOT.CODCMO = CMO.CODCMO -- cad. classificacao motorista
LEFT OUTER JOIN RODMUN MUN on MOT.CODMUN = MUN.CODMUN -- cad. unidade de municipio (endereco do motorista)
LEFT OUTER JOIN RODMUN MUNR on MOT.CIDARG = MUNR.CODMUN -- cad. unidade de municipio (RG)
LEFT OUTER JOIN RODMUN MUNC on MOT.CCIDAD = MUNC.CODMUN -- cad. unidade de municipio (carteira profissional)
LEFT OUTER JOIN RODMUN MUNP on MOT.MUNPRO = MUNP.CODMUN -- cad. unidade de municipio (prontuario)
LEFT OUTER JOIN RODMUN MUNH on MOT.CARTCI = MUNH.CODMUN -- cad. unidade de municipio (CNH)
LEFT OUTER JOIN RODCUS CUS on MOT.CODCUS = CUS.CODCUS -- cad. centro de custos
LEFT OUTER JOIN RODCGA CGA on MOT.CODCGA = CGA.CODCGA -- cad. centro de gastos
LEFT OUTER JOIN RODBCO BCO on MOT.CODBCO = BCO.CODBCO -- cad. de bancos
LEFT OUTER JOIN RODCOM COM on MOT.CODCOM = COM.CODCOM -- cad. de comissão
           JOIN RODFIL FIL ON FIL.CODFIL = MOT.CODFIL -- cad. de filial
           JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
LEFT OUTER JOIN RODCLI CLI on MOT.CODCLIFOR = CLI.CODCLIFOR -- cad. parceiro comercial (Sbustituir pelo API de parceiro comercial)
LEFT OUTER JOIN RODVEI VEI on VEI.CODVEI = MOT.PLACAV -- cad. marca do veículo (Sbustituir pelo API de veiculo)
LEFT OUTER JOIN RODMCV MCV on VEI.CODMCV = MCV.CODMCV -- cad. marca do veículo (Sbustituir pelo API de veiculo)
LEFT OUTER JOIN RODMDV MDV on VEI.CODMDV = MDV.CODMDV -- cad. modelo do veículo (Sbustituir pelo API de veiculo)
WHERE (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')  -- Filtro multi empresa de acordo com os acessos do usuario logado
AND MOT.CODMOT = :pId`

const sqlMotoristaListarGerenciamentoRisco = (pPermissaoFiliais) => `
SELECT
@@ORDENACAOLINHA@@
GRI.CODGRI codigoGerenciadorRisco,
CLI.NOMEAB nomeGestoraRisco,
GRI.CODGER numeroCAD,
GRI.TIPGRI tipoPadroGR,
GRI.SITUAC identificacaoStatusGestorRisco,
CASE WHEN GRI.SITUAC = 'INAP' THEN 'INAPTO'
     WHEN GRI.SITUAC = 'APTO' THEN 'APTO'
     WHEN GRI.SITUAC = 'ALPV' THEN 'AGUARDANDO LIB. PROX. VIAGEM'
     WHEN GRI.SITUAC = 'APTR' THEN 'APTO, COM RESTRIÇÕES'
     WHEN GRI.SITUAC = 'INAI' THEN 'INAPTO, INSUFICENCIA DE DADOS'
END descricaoStatusGestorRisco,
GRI.DATVAL dataValidade,
GRI.DATGER dataGeracaoRisco,
GRI.GEROBS descricaoObservacaoGestorRisco,
GRI.VLRCON valorConsulta,
GRI.VLRLMA valorLimiteManifesto,
GRI.SENGER valorSenha,
GRI.DATATU 'log.dataAlteracao',
GRI.USUATU 'log.usuarioAlteracao',
GRI.DATGER 'log.dataInclusao',
NULL 'log.usuarioInclusao'
FROM
          RODMOT MOT -- cad. de Motorista
     JOIN RODGRI GRI ON GRI.CODMOT = MOT.CODMOT-- Ger. de ricso
LEFT JOIN RODCLI CLI ON CLI.CODCLIFOR = GRI.CODGRI -- Parceiro comercial gestora de risco
     JOIN RODFIL FIL ON FIL.CODFIL = MOT.CODFIL -- cad. de filial
     JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
WHERE (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')  -- Filtro multi empresa de acordo com os acessos do usuario logado
@@FILTRO@@
`

const sqlMotoristaListarAnexo = (pPermissaoFiliais) => `
SELECT
  @@ORDENACAOLINHA@@
  IMO.CODMOT codigoMotorista,
  IMO.CODFIL codigoFilial,
  IMO.CODIMO codigoImagemMotorista,
  IMO.TIPDOC tipoDocumento,
  CASE WHEN IMO.TIPDOC = '1' THEN 'RG'
       WHEN IMO.TIPDOC = '2' THEN 'CPF'
       WHEN IMO.TIPDOC = '3' THEN 'CNH'
       WHEN IMO.TIPDOC = '4' THEN 'OUTROS'
       WHEN IMO.TIPDOC = '5' THEN 'MOOP'
       WHEN IMO.TIPDOC = '6' THEN 'CTPS'
       WHEN IMO.TIPDOC = '7' THEN 'TITULOS'
       WHEN IMO.TIPDOC = '8' THEN 'EXAMES'
       WHEN IMO.TIPDOC = '9' THEN 'COMPROVANTES'
  END descricaoTipoDocumento,
  IMO.CAMFOT nomeDocumento,
  IMO.DATINC 'log.dataInclusao',
  IMO.USUINC 'log.usuarioInclusao',
  IMO.DATATU 'log.dataAlteracao',
  IMO.USUATU 'log.usuarioAlteracao',
  EMP.CODEMP codigoEmpreasa
FROM RODIMO IMO
INNER JOIN RODFIL FIL ON FIL.CODFIL = IMO.CODFIL -- cad. de filial
INNER JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
WHERE (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')  -- Filtro multi empresa de acordo com os acessos do usuario logado
@@FILTRO@@`

const sqlMotoristaObterAnexo = (pPermissaoFiliais) => `
SELECT
  IMO.CODMOT codigoMotorista,
  IMO.CODFIL codigoFilial,
  IMO.CODIMO codigoImagemMotorista,
  IMO.TIPDOC tipoDocumento,
  CASE WHEN IMO.TIPDOC = '1' THEN 'RG'
       WHEN IMO.TIPDOC = '2' THEN 'CPF'
       WHEN IMO.TIPDOC = '3' THEN 'CNH'
       WHEN IMO.TIPDOC = '4' THEN 'OUTROS'
       WHEN IMO.TIPDOC = '5' THEN 'MOOP'
       WHEN IMO.TIPDOC = '6' THEN 'CTPS'
       WHEN IMO.TIPDOC = '7' THEN 'TITULOS'
       WHEN IMO.TIPDOC = '8' THEN 'EXAMES'
       WHEN IMO.TIPDOC = '9' THEN 'COMPROVANTES'
  END descricaoTipoDocumento,
  IMO.CAMFOT nomeDocumento,
  EMP.CODEMP codigoEmpresa,
  IMO.DATINC 'log.dataInclusao',
  IMO.USUINC 'log.usuarioInclusao',
  IMO.DATATU 'log.dataAlteracao',
  IMO.USUATU 'log.usuarioAlteracao'

FROM RODIMO IMO
INNER JOIN RODFIL FIL ON FIL.CODFIL = IMO.CODFIL -- cad. de filial
INNER JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
WHERE (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')  -- Filtro multi empresa de acordo com os acessos do usuario logado
AND IMO.CODIMO = :pId`

const sqlTotais = (pPermissaoFiliais, pFiltro) => `
SELECT
  COALESCE(SUM(CASE WHEN MOT.CODCMO=5 THEN 1 ELSE 0 END),0) motoristasAgregados,
  COALESCE(SUM(CASE WHEN MOT.CODCMO=6 THEN 1 ELSE 0 END),0) mototistasTerceiros,
  COALESCE(SUM(CASE WHEN MOT.CODCMO=8 THEN 1 ELSE 0 END),0) motoristasFrotas,

  COALESCE(SUM(CASE WHEN MOT.SITUAC IN('I') THEN 1 ELSE 0 END),0) motoristasInaptos,   
  COALESCE(SUM(CASE WHEN MOT.SITUAC = 'L' THEN 1 ELSE 0 END),0) mototistasAguardandoLiberacao,
  COALESCE(SUM(CASE WHEN MOT.SITUAC NOT IN('I','A','I') THEN 1 ELSE 0 END),0) motoristasAptosRestricao,
  COALESCE(SUM(CASE WHEN MOT.SITUAC = 'A' THEN 1 ELSE 0 END),0) motoristasAptos
FROM RODMOT MOT
 JOIN RODCMO CMO ON (MOT.CODCMO = CMO.CODCMO)
 JOIN RODFIL FIL ON FIL.CODFIL = MOT.CODFIL
WHERE 
${pFiltro}
AND (FIL.CODFIL IN (${pPermissaoFiliais || ''}) OR '${pPermissaoFiliais}'='-1')`

const sql = {
     sqlMotoristaListar,
     sqlMotoristaStatusGestoraRisco,
     sqlMotoristaSituacao,
     sqlMotoristaObterDadosPessoais,
     sqlMotoristaObterOutrasInformacoes,
     sqlMotoristaObterDocumentacao,
     sqlMotoristaListarGerenciamentoRisco,
     sqlMotoristaListarAnexo,
     sqlMotoristaObterAnexo,
     sqlTotais
}

export default sql
