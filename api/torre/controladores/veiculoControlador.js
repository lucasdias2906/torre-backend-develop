import express from 'express'
import veiculoServico from '../servicos/veiculoServico'
import veiculoClassificacaoServico from '../servicos/veiculoClassificacaoServico'
import veiculoTipoVinculoServico from '../servicos/veiculoTipoVinculoServico'
import veiculoCustoFixoServico from '../servicos/veiculoCustoFixoServico'
import veiculoCustoVariavelServico from '../servicos/veiculoCustoVariavelServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listar(req)
  res.status(200).json(retorno)
}))

router.get('/marca', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarMarca(req)
  res.status(200).json(retorno)
}))

router.get('/tipoVinculo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoTipoVinculoServico.listar(req)
  res.status(200).json(retorno)
}))

router.get('/tipoVeiculo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarClassificacao(req)
  res.status(200).json(retorno)
}))

router.get('/situacaoVeiculo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarVeiculoSituacao(req)
  res.status(200).json(retorno)
}))

router.get('/classificacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarClassificacao(req)
  res.status(200).json(retorno)
}))

router.get('/classificacao/:pCodigo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.obterClassificacao(req.params.pCodigo)
  res.status(200).json(retorno)
}))

router.get('/ocorrencias', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarOcorrencia(req)
  res.status(200).json(retorno)
}))

router.get('/regiaoOperacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarRegiaoOperacao(req)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoVeiculo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.obter(req.params.pCodigoVeiculo, req)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoVeiculo/parametrosLicencas', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.obterParametrosLicencas(req.params.pCodigoVeiculo, req)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoRegiaoOperacao/regiaoOperacaoVigencia', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.obterRegiaoOPVigencia(req.params.pCodigoRegiaoOperacao, req.query)
  res.status(200).json({ dados: retorno })
}))

router.get('/:pMarcaID/modelo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarModelo(req.params.pMarcaID)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoVeiculo/cursosLicencas/vencido', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarCursosLicencas(req.params.pCodigoVeiculo, 'vencido', req)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoVeiculo/cursosLicencas/valido', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoServico.listarCursosLicencas(req.params.pCodigoVeiculo, 'valido', req)
  res.status(200).json(retorno)
}))

router.post('/:pCodigoVeiculo/custoFixo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoFixoServico.incluir(req.params.pCodigoVeiculo, req)
  res.status(200).json(retorno)
}))

router.put('/custoFixo/:pCustoFixo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoFixoServico.alterar(req.params.pCustoFixo, req)
  res.status(200).json(retorno)
}))

router.delete('/custoFixo/:pCustoFixo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoFixoServico.excluir(req.params.pCustoFixo)
  res.status(200).json({ dados: retorno })
}))

router.get('/:pCodigoVeiculo/custoFixo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoFixoServico.listar(req.params.pCodigoVeiculo, req.query)
  res.status(200).json(retorno)
}))

router.get('/custoFixo/:pCustoFixo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoFixoServico.obter(req.params.pCustoFixo, req.query)
  res.status(200).json(retorno)
}))

router.post('/:pCodigoVeiculo/custoVariavel', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoVariavelServico.incluir(req.params.pCodigoVeiculo, req)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoVeiculo/custoVariavel', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoVariavelServico.listar(req.params.pCodigoVeiculo, req.query)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoClassificacao/verificarClassificacao/custoVariavel', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoClassificacaoServico.verificarClassificacao(req.params.pCodigoClassificacao)
  res.status(200).json(retorno)
}))

router.put('/custoVariavel/:pCustoVariavel', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoVariavelServico.alterar(req.params.pCustoVariavel, req)
  res.status(200).json(retorno)
}))

router.delete('/custoVariavel/:pCustoVariavel', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoVariavelServico.excluir(req.params.pCustoVariavel)
  res.status(200).json({ dados: retorno })
}))

router.get('/custoVariavel/:pCustoVariavel', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await veiculoCustoVariavelServico.obter(req.params.pCustoVariavel, req.query)
  res.status(200).json({ dados: retorno })
}))

export default router


// #region // swagger /veiculo/
/**
   * @swagger
   * /veiculo:
   *   get:
   *     summary: Listagem dos Veículos
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description: Campo para ordenação Ex - nomeProprietario
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         type: string
   *         description: asc ou desc
   *       - in: query
   *         required: false
   *         name: codigoVeiculo
   *         description: código do veículo
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificacaoPlacaVeiculo
   *         description: Placa do veiculo
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificacaoTipoVeiculo
   *         description: Tipo de Veículo
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoClassificacao
   *         description: codigo da Classificação
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoMarca
   *         description: Codigo da Marca
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoModeloVeiculo
   *         description: Código do Modelo do Veículo
   *         type: string
   *       - in: query
   *         required: false
   *         name: nomeProprietario
   *         description: Nome do Proprietário
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificacaoTipoVinculoProprietario
   *         description: Vínculo
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificacaoSituacaoVeiculo
   *         description: Situação do Veículo
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /marca
/**
   * @swagger
   * /veiculo/marca:
   *   get:
   *     summary: Marca
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: marca
   */
// #endregion

// #region /tipoVinculo
/**
   * @swagger
   * /veiculo/tipoVinculo:
   *   get:
   *     summary: tipoVinculo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: tipo vínculo
   */
// #endregion

// #region /tipoVeiculo
/**
   * @swagger
   * /veiculo/tipoVeiculo:
   *   get:
   *     summary: tipoVeiculo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: tipo de veículo
   */
// #endregion

// #region /situacaoVeiculo
/**
   * @swagger
   * /veiculo/situacaoVeiculo:
   *   get:
   *     summary: situacaoVeiculo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: situação do veículo
   */
// #endregion

// #region /classificacao
/**
   * @swagger
   * /veiculo/classificacao:
   *   get:
   *     summary: classificacao
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description: Campo para ordenação Ex - codigoClassificacao,descricaoClassificacao
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         description: asc ou desc
   *         type: string
   *     responses:
   *       200:
   *         description: classificacão
   */
// #endregion


// #region /veiculo/classificacao/codigo
/**
   * @swagger
   * /veiculo/classificacao/{pCodigo}:
   *   get:
   *     summary: classificacao obter por código
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigo
   *         description: código da classificação
   *         type: string
   *     responses:
   *       200:
   *         description: classificacão por código
   */
// #endregion


// #region /veiculo/ocorrencias
/**
   * @swagger
   * /veiculo/ocorrencias:
   *   get:
   *     summary: ocorrencias
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: codigoVeiculo
   *         description: código do veículo
   *         type: string
   *     responses:
   *       200:
   *         description: ocorrências
   */
// #endregion

// #region /veiculo/regiaoOperacao
/**
   * @swagger
   * /veiculo/regiaoOperacao:
   *   get:
   *     summary: regiaoOperacao
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: regiaoOperacao
   */
// #endregion

// #region /veiculo/{codigoVeiculo}
/**
   * @swagger
   * /veiculo/{codigoVeiculo}:
   *   get:
   *     summary: Obter veículo pelo código
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: codigoVeiculo
   *         default: AAP3819
   *         description: código do veículo
   *         type: string
   *     responses:
   *       200:
   *         description: obter veículo pelo código
   */
// #endregion

// #region /veiculo/{codigoVeiculo}/parametrosLicencas
/**
   * @swagger
   * /veiculo/{codigoVeiculo}/parametrosLicencas:
   *   get:
   *     summary: parametros licença
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: codigoVeiculo
   *         default: AAP3819
   *         description: código do veículo
   *         type: string
   *     responses:
   *       200:
   *         description: licenca
   */
// #endregion

// #region /veiculo/{pCodigoRegiaoOperacao}/regiaoOperacaoVigencia
/**
   * @swagger
   * /veiculo/{pCodigoRegiaoOperacao}/regiaoOperacaoVigencia:
   *   get:
   *     summary: Região de Operação
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoRegiaoOperacao
   *         description: código da região de operação
   *         type: string
   *       - in: query
   *         required: true
   *         name: vigenciaRegiaoOperacao
   *         description: Data da vigencia regiao operação
   *         type: string
   *     responses:
   *       200:
   *         description: Região de Operação
   */
// #endregion

// #region /veiculo/{pMarcaID}/modelo
/**
   * @swagger
   * /veiculo/{pMarcaID}/modelo:
   *   get:
   *     summary: Modelos
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pMarcaID
   *         default: 1
   *         description: id da marca
   *         type: string
   *     responses:
   *       200:
   *         description: Modelos
   */
// #endregion

// #region /veiculo/{pCodigoVeiculo}/cursosLicencas/vencido
/**
   * @swagger
   * /veiculo/{codigoVeiculo}/cursosLicencas/vencido:
   *   get:
   *     summary: Licencas vencidas
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: codigoVeiculo
   *         description: código do veículo
   *         default: INX0263
   *         type: string
   *     responses:
   *       200:
   *         description: Licencas vencidas
   */
// #endregion

// #region /veiculo/{codigoVeiculo}/cursosLicencas/valido
/**
   * @swagger
   * /veiculo/{codigoVeiculo}/cursosLicencas/valido:
   *   get:
   *     summary: Licencas vencidas
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: codigoVeiculo
   *         description: código do veículo
   *         default: CXA6960
   *         type: string
   *     responses:
   *       200:
   *         description: Licencas vencidas
   */
// #endregion


// #region /veiculo/{pCodigoVeiculo}/custoFixo
/**
   * @swagger
   * /veiculo/{pCodigoVeiculo}/custoFixo:
   *   post:
   *     summary: Inserir custo fixo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: custofixo
   *         description: Custo fixo a ser inserido
   *         example:
   *           codigoVeiculo: "AAA1111"
   *           vigenciaCustoFixo: "2021-02-11T18:16:41.279Z"
   *           custoReposicaoFrota: 10
   *           custoRemuneracaoFrota: 10
   *           custoMotoristaTotal: 10
   *           custoFixoTotal: 10
   *           custoDocumentosImpostos: 10
   *           custoRastreador: 10
   *           custoSeguro: 10
   *     responses:
   *       200:
   *         description: custo fixo
   */
// #endregion


// #region /veiculo/custoFixo/{pCustoFixo}
/**
   * @swagger
   * /veiculo/custoFixo/{pCustoFixo}:
   *   put:
   *     summary: Atualizar custo fixo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCustoFixo
   *         description: código do custo fixo
   *         type: string
   *     responses:
   *       200:
   *         description: Atualizar custo fixo
   */
// #endregion

// #region /veiculo/custoFixo/:pCustoFixo
/**
   * @swagger
   * /veiculo/custoFixo/{pCustoFixo}:
   *   delete:
   *     summary: Excluir custo fixo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCustoFixo
   *         description: código do custo fixo
   *         type: string
   *     responses:
   *       200:
   *         description: Excluir custo fixo
   */
// #endregion

// #region /veiculo/{pCodigoVeiculo}/custoFixo
/**
   * @swagger
   * /veiculo/{pCodigoVeiculo}/custoFixo:
   *   get:
   *     summary: Obter custo fixo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoVeiculo
   *         description: código do veículo
   *         type: string
   *     responses:
   *       200:
   *         description: obter custo fixo
   */
// #endregion


// #region /veiculo/custoFixo/{pCustoFixo}
/**
   * @swagger
   * /veiculo/custoFixo/{pCustoFixo}:
   *   get:
   *     summary: Obter custo fixo
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         default: 5ec6796cde173b2c84d1b4f6
   *         name: pCustoFixo
   *         description: código do custo fixo
   *         type: string
   *     responses:
   *       200:
   *         description: obter custo fixo
   */
// #endregion

// #region /veiculo/{pCodigoVeiculo}/custoVariavel
/**
   * @swagger
   * /veiculo/{pCodigoVeiculo}/custoVariavel:
   *   post:
   *     summary: gravar custo variável
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: custo variável
   *         description: Inserção de custo variável
   *         example:
   *           codigoVeiculo: "AAA111"
   *           codigoRegiaoOperacao: 0
   *           dataVigenciaVariavel: "2022-01-01"
   *           custoOleoDiesel: 0
   *           custoMediaConsumo: 0
   *           combustivelPorKm: 0
   *           custoGalaoArla: 0
   *           mediaConsumoArla: 0
   *           arlaPorKm: 0
   *           custoPneu: 0
   *           kmsPorPneu: 0
   *           pneuPorKm: 0
   *           custoLavagem: 0
   *           despesasViagem: 0
   *           comissaoMotorista: 0
   *           custoManutencaoKm: 0
   *     responses:
   *       200:
   *         description: gravar custo variável
   */
// #endregion


// #region /veiculo/{pCodigoVeiculo}/custoVariavel
/**
   * @swagger
   * /veiculo/{pCodigoVeiculo}/custoVariavel:
   *   get:
   *     summary: Obter custo variável
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoVeiculo
   *         description: código do veículo
   *         type: string
   *     responses:
   *       200:
   *         description: obter custo fixo
   */
// #endregion

// #region /veiculo/{pCodigoClassificacao}/verificarClassificacao/custoVariavel
/**
   * @swagger
   * /veiculo/{pCodigoClassificacao}/verificarClassificacao/custoVariavel:
   *   get:
   *     summary: Verificar classificação custo variável
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoClassificacao
   *         description: código da classificação
   *         type: string
   *     responses:
   *       200:
   *         description:  Verificar classificação custo variável
   */
// #endregion

// #region /veiculo/custoVariavel/{pCustoVariavel}
/**
   * @swagger
   * /veiculo/custoVariavel/{pCustoVariavel}:
   *   put:
   *     summary: Atualizar classificação custo variável
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: custovariavel
   *         description: Atualização de custo variável
   *         example:
   *           codigoVeiculo: "AAA111"
   *           codigoRegiaoOperacao: 0
   *           dataVigenciaVariavel: "2022-01-01"
   *           custoOleoDiesel: 0
   *           custoMediaConsumo: 0
   *           combustivelPorKm: 0
   *           custoGalaoArla: 0
   *           mediaConsumoArla: 0
   *           arlaPorKm: 0
   *           custoPneu: 0
   *           kmsPorPneu: 0
   *           pneuPorKm: 0
   *           custoLavagem: 0
   *           despesasViagem: 0
   *           comissaoMotorista: 0
   *           custoManutencaoKm: 0
   *     responses:
   *       200:
   *         description:  Atualizar classificação custo variável
   */
// #endregion

// #region /veiculo/custoVariavel/{pCustoVariavel}
/**
   * @swagger
   * /veiculo/custoVariavel/{pCustoVariavel}:
   *   delete:
   *     summary: excluir custo variável
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCustoVariavel
   *         description: código do custo variável
   *         type: string
   *     responses:
   *       200:
   *         description:  excluir custo variável
   */
// #endregion

// #region /veiculo/custoVariavel/{pCustoVariavel}
/**
   * @swagger
   * /veiculo/custoVariavel/{pCustoVariavel}:
   *   get:
   *     summary: obter custo variável
   *     content:
   *       application/json:
   *     tags: [Veículo]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCustoVariavel
   *         description: código do custo variável
   *     responses:
   *       200:
   *         description:  obter custo variável
   */
// #endregion
