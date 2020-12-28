import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import erroControlador from './controladores/_erroControlador'

import motoristaControlador from './controladores/motoristaControlador'
import filialControlador from './controladores/filialControlador'
import empresaControlador from './controladores/empresaControlador'
import grupoControlador from './controladores/grupoControlador'
import usuarioControlador from './controladores/usuarioControlador'
import veiculoControlador from './controladores/veiculoControlador'
import tipoCargaControlador from './controladores/tipoCargaControlador'
import parceiroControlador from './controladores/parceiroControlador'
import fornecedorControlador from './controladores/fornecedorControlador'
import ocorrenciaControlador from './controladores/ocorrenciaControlador'
import classificacaoControlador from './controladores/classificacaoControlador'
import cursoLicencaControlador from './controladores/cursoLicencaControlador'
import rotaControlador from './controladores/rotaControlador'
import disponibilidadeControlador from './controladores/disponibilidadeControlador'
import pedidoControlador from './controladores/pedidoControlador'
import mapaSinoticoControlador from './controladores/mapaSinoticoControlador'
import monitoramentoControlador from './controladores/monitoramentoControlador'

require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configurações de rotas
app.use('/hub/motorista', motoristaControlador)
app.use('/hub/filial', filialControlador)
app.use('/hub/empresa', empresaControlador)
app.use('/hub/grupo', grupoControlador)
app.use('/hub/usuario', usuarioControlador)
app.use('/hub/veiculo', veiculoControlador)
app.use('/hub/tipocarga', tipoCargaControlador)
app.use('/hub/parceiro', parceiroControlador)
app.use('/hub/ocorrencia', ocorrenciaControlador)
app.use('/hub/classificacao', classificacaoControlador)
app.use('/hub/cursoLicenca', cursoLicencaControlador)
app.use('/hub/rota', rotaControlador)
app.use('/hub/fornecedor', fornecedorControlador)
app.use('/hub/disponibilidade', disponibilidadeControlador)
app.use('/hub/pedido', pedidoControlador)
app.use('/hub/mapaSinotico', mapaSinoticoControlador)
app.use('/hub/monitoramento', monitoramentoControlador)

// Configuração de rota referente ao controle de erros
app.use(erroControlador)

const vPorta = process.env.PORT

app.listen(vPorta, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor rodando na porta ${vPorta}`)
})

module.exports = app
