import express from "express";
import autenticacaoServico from "../servicos/autenticacaoServico";
import dashboardServico from "../servicos/dashboardServico";
import asyncMiddleware from "../funcoes/asyncMiddleware";

const router = express.Router();

router.get(
  "/ocorrencias",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarOcorrencias(req);
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/motoristas",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarVeiculos(req);
    res.status(200).json(vRetorno);

  })
);

router.get(
  "/veiculos",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarVeiculosDisponiveisAlocados(req);
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/status",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarStatus(req);
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/criticidade",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarCriticidade(req);
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/tipo",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarTipoOcorrencias(req);
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/ocorrencias/resumo-criticidade",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = ""
    const vRetorno = await dashboardServico.listarCriticidade(req);  /// Pronto pra testar 
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/pedido",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {     
    const vRetorno = await dashboardServico.listarPedidos(req); //50 % e verificar pedidosEmAlocacaoAtrasada (Verificar Ocorrencias)
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/historico-diario",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarOcorrenciasHistorico(req);  /// Pronto pra testar 
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/motoristas-disponiveis",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarMotoristasDisponiveis(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/veiculos-disponiveis",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarVeiculosDisponiveis(req); /// Pronto pra testar   
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance",
  autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
    const doc = await dashboardServico.listarPerformance(req);
    res.writeHead(200, { "content-type": "application/pdf" });
    doc.pipe(res);
    doc.end();

    //const wkhtmltopdf = require('wkhtmltopdf');

    //wkhtmltopdf.command = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe";

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename = "TORRE-${new Date().getDate()}-Performance.pdf"`,
    });

    // wkhtmltopdf('http://apple.com')
    //   .pipe(res)
  })
);

router.get(
  "/performance/motorista-disponivel-alocado",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarMotoristasDisponiveisAlocados(req); /// Pronto pra testar  
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/motorista-classificacoes",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarMotoristasClassificacoes(req); /// Pronto pra testar     
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/motorista-status",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarMotoristasStatus(req); /// Pronto pra testar        
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/motorista-ocorrencias",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = 'MOTORISTA'
    const vRetorno = await dashboardServico.listarCriticidade(req); /// Pronto pra testar      
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/motorista-historico",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = 'MOTORISTA'
    const vRetorno = await dashboardServico.listarOcorrenciasHistorico(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/veiculo-disponivel-alocado",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarVeiculosDisponiveisAlocados(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/veiculo-classificacoes",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarVeiculosClassificacoes(req); /// Pronto pra testar  
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/veiculo-status",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarStatus(req); /// Pronto pra testar  
    res.status(200).json(vRetorno);
  })
);


router.get(
  "/performance/veiculo-ocorrencias",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = 'VEICULO'
    const vRetorno = await dashboardServico.listarCriticidade(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/veiculo-historico",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = 'VEICULO'
    const vRetorno = await dashboardServico.listarOcorrenciasHistorico(req);/// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/ocorrencias-abertas",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarStatus(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/ocorrencias-sla",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarOcorrenciaSla(req);   /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/ocorrencias-origem",
  autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarOcorrenciaOrigem(req); /// Pronto pra testar  
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/ocorrencia-historico",
   autenticacaoServico.validarToken,  
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarOcorrenciasHistorico(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/pedido-ocorrencia-abertas",
   autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = 'PEDIDO'
    const vRetorno = await dashboardServico.listarStatus(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/pedido-historico",
   autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = 'PEDIDO'
    const vRetorno = await dashboardServico.listarOcorrenciasHistorico(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/pedido-tipo-ocorrencia",
   autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    req.query.origem = 'PEDIDO'
    const vRetorno = await dashboardServico.listarTipoOcorrencias(req); /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/pedido-viagem",
   autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => {
    const vRetorno = await dashboardServico.listarPedidosEmViagem(req);  /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);

router.get(
  "/performance/pedido-ocorrencia-critica",
   autenticacaoServico.validarToken,
  asyncMiddleware(async (req, res) => { 
    const vRetorno = await dashboardServico.listarPedidosOcorrencias(req);  /// Pronto pra testar
    res.status(200).json(vRetorno);
  })
);


export default router


/**
   * @swagger
   * /dashboard/ocorrencias:
   *   get:
   *     summary: Total de ocorrências por status
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: dashboard
   */

/**
   * @swagger
   * /dashboard/motoristas:
   *   get:
   *     summary: Total de motoristas por status
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     parameters:
   *       - in: query
   *         required: true
   *         name: periodoViagemInicial
   *         description: Data início da Viagem
   *         default: "2020-03-23T04:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemFinal
   *         description: Data final da Viagem
   *         default: "2020-03-23T04:00:00.000Z"
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: dashboard
   */


/**
   * @swagger
   * /dashboard/veiculos:
   *   get:
   *     summary: Total de veículos por status
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     parameters:
   *       - in: query
   *         required: true
   *         name: periodoViagemInicial
   *         description: Data início da Viagem
   *         default: "2020-03-23T04:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: true
   *         name: periodoViagemFinal
   *         description: Data final da Viagem
   *         default: "2020-03-23T04:00:00.000Z"
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: dashboard
   */

/**
   * @swagger
   * /dashboard/pedidos:
   *   get:
   *     summary: Total de pedidos por status
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     parameters:
   *       - in: query
   *         required: true
   *         name: dataRetiradaInicial
   *         description: Data retirada inicial
   *         default: "2020-03-23T04:00:00.000Z"
   *         type: string
   *       - in: query
   *         required: true
   *         name: dataRetiradaFinal
   *         description: Data retirada final
   *         default: "2020-03-23T04:00:00.000Z"
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: dashboard
   */


/**
   * @swagger
   * /dashboard/status:
   *   get:
   *     summary: Listgem dos status
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: dashboard
   */

/**
   * @swagger
   * /dashboard/criticidade:
   *   get:
   *     summary: Listgem das criticidades
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: dashboard
   */

/**
   * @swagger
   * /dashboard/tipo:
   *   get:
   *     summary: Listgem das tipos
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: dashboard
   */

/**
   * @swagger
   * /dashboard/performance:
   *   get:
   *     summary: Listgem da performance
   *     content:
   *       application/json:
   *     tags: [Dashboard]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: performance
   */
