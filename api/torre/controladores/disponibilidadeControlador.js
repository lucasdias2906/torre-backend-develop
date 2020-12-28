import express from 'express'
import autenticacaoServico from '../servicos/autenticacaoServico'
import disponibilidadeServico from '../servicos/disponibilidadeServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/motorista', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.listarMotorista(req)
  res.status(200).json(vRetorno)
}))

router.get('/:pCodigoMotorista/motorista', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.validarMotorista(req.params.pCodigoMotorista, req)
  res.status(200).json(vRetorno)
}))

router.get('/veiculo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.listarVeiculo(req)
  res.status(200).json(vRetorno)
}))

router.get('/:pPlaca/veiculo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.validarVeiculo(req.params.pPlaca, req)
  res.status(200).json(vRetorno)
}))

export default router

/**
   * @swagger
   * /disponibilidade/motorista:
   *   get:
   *     summary: Listagem dos motoristas disponíveis
   *     content:
   *       application/json:
   *     tags: [Disponibilidade]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: true
   *         name: periodoViagemInicial
   *         description: Data Início da Viagem
   *         default: "2021-02-11T10:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemFinal
   *         description: Data Final da Viagem
   *         default: "2021-02-11T18:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: false
   *         name: placa
   *         description: Placa do veículo
   *         type: string
   *       - in: query
   *         required: false
   *         name: nomeMotorista
   *         description: Nome do motorista
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoMotorista
   *         description: Código do motorista
   *         default: 5013
   *         type: string
   *       - in: query
   *         required: false
   *         name: numeroCPF
   *         description: Número do CPF do motorista
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificacaoRegistrado
   *         description: S ou N (Indica se é um motorista registrado da Mirassol)
   *         default: "N"
   *         type: string
   *       - in: query
   *         required: true
   *         name: categoriaCNH
   *         description: Categoria Exigida
   *         default: "A"
   *         type: string
   *       - in: query
   *         required: true
   *         name: situacao
   *         description: Situção do Motorista D) disponível T) Todos
   *         default: "D"
   *         type: string
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description:
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         default: 1
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         type: string
   *         description: asc ou desc
   *     responses:
   *       200:
   *         description: motorista
   */

/**
   * @swagger
   * /disponibilidade/{pCodigoMotorista}/motorista:
   *   get:
   *     summary: Valida se um motorista disponível pelo código
   *     content:
   *       application/json:
   *     tags: [Disponibilidade]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoMotorista
   *         description: Código do motorista
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemInicial
   *         description: Data Início da Viagem
   *         default: "2021-02-11T10:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemFinal
   *         description: Data Final da Viagem
   *         default: "2021-02-11T18:00:00.000Z"
   *         type: string
   *     responses:
   *       200:
   *         description: motorista
   */

/**
   * @swagger
   * /disponibilidade/veiculo:
   *   get:
   *     summary: Listagem dos veículos disponíveis
   *     content:
   *       application/json:
   *     tags: [Disponibilidade]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: true
   *         name: periodoViagemInicial
   *         description: Data Início da Viagem
   *         default: "2021-02-11T10:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemFinal
   *         description: Data Final da Viagem
   *         default: "2021-02-11T18:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoClassificacaoVeiculo
   *         description: Código da classificação do veículo
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoTipoVeiculo
   *         description: Código do tipo do veículo
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificacaoVeiculoProprio
   *         description: S ou N para verificação se é veículo próprio
   *         default: "S"
   *         type: string
   *       - in: query
   *         required: false
   *         name: placa
   *         description: Placa do veículo
   *         default: "ASQ-1777"
   *         type: string
   *       - in: query
   *         required: false
   *         name: tracionador
   *         description: Veiculos Tracionadores S) Não Tracionadores N) Vazio Todos
   *         default: "S"
   *         type: string
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description:
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         default: 1
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         type: string
   *         description: asc ou desc
   *     responses:
   *       200:
   *         description: veiculo
   */

/**
   * @swagger
   * /disponibilidade/{pPlaca}/veiculo:
   *   get:
   *     summary: Valida se um veículo está disponível pelo código
   *     content:
   *       application/json:
   *     tags: [Disponibilidade]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         description: placa do veículo
   *         name: pPlaca
   *         default: ASQ-1777
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemInicial
   *         description: Data Início da Viagem
   *         default: "2021-02-11T10:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemFinal
   *         description: Data Final da Viagem
   *         default: "2021-02-11T18:00:00.000Z"
   *         type: string
   *     responses:
   *       200:
   *         description: veiculo
   */
