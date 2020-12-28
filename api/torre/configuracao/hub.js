require('dotenv').config()

const hub_tms_host = `http://${process.env.HUM_TMS_HOST}`
const hub_tms_port = process.env.HUB_TMS_PORT ? `:${process.env.HUB_TMS_PORT}` : ''

const url_servicos = `${hub_tms_host}${hub_tms_port}`

module.exports = {
  filial: `${url_servicos}/hub/filial`,
  grupo: `${url_servicos}/hub/grupo`,
  empresa: `${url_servicos}/hub/empresa`,
  usuario: `${url_servicos}/hub/usuario`,
  motorista: `${url_servicos}/hub/motorista`,
  veiculo: `${url_servicos}/hub/veiculo`,
  tipoCarga: `${url_servicos}/hub/tipocarga`,
  fornecedor: `${url_servicos}/hub/fornecedor`,
  parceiro: `${url_servicos}/hub/parceiro`,
  ocorrencia: `${url_servicos}/hub/ocorrencia`,
  classificacao: `${url_servicos}/hub/classificacao`,
  cursoLicenca: `${url_servicos}/hub/cursolicenca`,
  regiaoOperacao: `${url_servicos}/hub/regiaoOperacao`,
  rota: `${url_servicos}/hub/rota`,
  disponibilidade: `${url_servicos}/hub/disponibilidade`,
  pedido: `${url_servicos}/hub/pedido`,
  mapaSinotico: `${url_servicos}/hub/mapaSinotico`,
  monitoramento: `${url_servicos}/hub/monitoramento`,
}
