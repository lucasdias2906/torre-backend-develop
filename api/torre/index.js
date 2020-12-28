// =======================
// Imports necessarios index Global
// =======================
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import configuracaoBanco from './configuracao/database'
import erroControlador from './controladores/_erroControlador'
import cargaDadosControlador from './controladores/cargaDadosControlador'
import funcionalidadeControlador from './controladores/funcionalidadeControlador'
import moduloControlador from './controladores/moduloControlador'
import perfilControlador from './controladores/perfilControlador'
import usuarioControlador from './controladores/usuarioControlador'
import autenticacaoControlador from './controladores/autenticacaoControlador'
import grupoControlador from './controladores/grupoControlador'
import filialControlador from './controladores/filialControlador'
import empresaControlador from './controladores/empresaControlador'
import veiculoControlador from './controladores/veiculoControlador'
import tipoCargaControlador from './controladores/tipoCargaControlador'
import motoristaControlador from './controladores/motoristaControlador'
import ocorrenciaControlador from './controladores/ocorrenciaControlador'
import parceiroControlador from './controladores/parceiroControlador'
import regiaoOperacaoControlador from './controladores/regiaoOperacaoControlador'
import fornecedorControlador from './controladores/fornecedorControlador'
import rotaControlador from './controladores/rotaControlador'
import poligonoControlador from './controladores/poligonoControlador'
import disponibilidadeControlador from './controladores/disponibilidadeControlador'
import tipoOcorrenciaControlador from './controladores/tipoOcorrenciaControlador'
import notificacaoControlador from './controladores/notificacaoControlador'
import pedidoControlador from './controladores/pedidoControlador'
import rastreadorControlador from './controladores/rastreadorControlador'
import mapaSinoticoControlador from './controladores/mapaSinoticoControlador'
import monitoramentoControlador from './controladores/monitoramentoControlador'
import dashboardControlador from './controladores/dashboardControlador'
import parametroGeralControlador from './controladores/parametroGeralControlador'

require('dotenv').config()
// =======================
// Configuração
// =======================
const app = express()

app.use(cors())

// Parser de requisição do express
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configurações de rota
app.use('/api/cargaDados', cargaDadosControlador)
app.use('/api/modulo', moduloControlador)
app.use('/api/funcionalidade', funcionalidadeControlador)
app.use('/api/perfil', perfilControlador)
app.use('/api/usuario', usuarioControlador)
app.use('/api', autenticacaoControlador)
app.use('/api/motorista', motoristaControlador)
app.use('/api/grupo', grupoControlador)
app.use('/api/filial', filialControlador)
app.use('/api/empresa', empresaControlador)
app.use('/api/veiculo', veiculoControlador)
app.use('/api/motorista', motoristaControlador)
app.use('/api/tipoCarga', tipoCargaControlador)
app.use('/api/ocorrencia', ocorrenciaControlador)
app.use('/api/fornecedor', fornecedorControlador)
app.use('/api/regiaoOperacao', regiaoOperacaoControlador)
app.use('/api/parceiro', parceiroControlador)
app.use('/api/rota', rotaControlador)
app.use('/api/poligono', poligonoControlador)
app.use('/api/disponibilidade', disponibilidadeControlador)
app.use('/api/tipoocorrencia', tipoOcorrenciaControlador)
app.use('/api/notificacao', notificacaoControlador)
app.use('/api/rastreador', rastreadorControlador)
app.use('/api/mapaSinotico', mapaSinoticoControlador)
app.use('/api/monitoramento', monitoramentoControlador)
app.use('/api/pedido', pedidoControlador)
app.use('/api/dashboard', dashboardControlador)
app.use('/api/parametroGeral', parametroGeralControlador)

// Configurações do Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

let vSwaggerHost = process.env.HUM_TMS_HOST || 'localhost'

vSwaggerHost += ':'

if (process.env.PORTA) vSwaggerHost += process.env.PORTA
else vSwaggerHost += '8080'

console.log(`Swagger: + ${vSwaggerHost}`)

swaggerDocument.host = vSwaggerHost

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Configuração de rota referente ao controle de erros
app.use(erroControlador)

app.use('/api/', express.Router())

// Conectando ao banco
mongoose.connect(configuracaoBanco.databaseTorre, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// =======================
// Inicialização do servidor
// =======================
const vPorta = process.env.PORTA || 3001

console.log(`Database: ${configuracaoBanco.databaseTorre}`)

app.listen(vPorta, () => {
  console.log(`Executando na porta: ${vPorta}`)
})

module.exports = app
