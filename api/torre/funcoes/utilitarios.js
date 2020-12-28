import UUID from 'uuid'
import bcrypt from 'bcryptjs'
import moment from 'moment-timezone'
import SisSequencia from '../modelos/_sisSequencia'
import Transaction from 'mongoose-transactions'

function dataValida(pData) {
  return moment(pData).isValid()
}

function diferencaData(pDataInicio, pDataFim) {
  return moment(pDataInicio).diff(pDataFim)
}

function obterDataCorrente() {
  return moment(moment().valueOf())
}

function obterDia(pData) {
  const data = moment(pData)
  return data.startOf('day')
}

function converterParaData(pDataString) {
  return moment(pDataString, 'YYYY-MM-DD HH:mm')
}

async function obterSequencia(nomeColuna) {
  let ret
  // let [cursor] = await SisSequencia.find({}, { seq: 1 }).sort({ seq: -1 }).limit(1);
  const [cursor] = await SisSequencia.find({ _id: nomeColuna }, { seq: 1 }).sort({ seq: -1 }).limit(1)

  const transaction = new Transaction()

  if (cursor) {
    const _id = cursor.seq + 1
    ret = await SisSequencia.findOneAndUpdate({ _id: nomeColuna }, { $set: { seq: _id } }, { new: true })
    return ret.seq
  } else {
    try {
      await transaction.insert('sisSequencia', { _id: nomeColuna, seq: 1 })
      await transaction.run()
    } catch (e) {
      transaction.rollback()
      throw ({ message: e.message })
    }
    return 1
  }
}

async function gerarSequencia(nomeColuna) {
  const vSeq = await SisSequencia.findOneAndUpdate({ _id: nomeColuna }, { $inc: { seq: 1 } }, { new: true, upsert: true })
  return vSeq.seq || 1 // se retornar null é o primeiro
}

function gerarUUID(pChave) {
  const uuID = UUID([pChave, Date()])
  const day = new Date()
  return {
    uuidConfirmacao: uuID,
    dataConfirmacao: day.setDate(day.getDate() + 2),
  }
}

async function gerarSenhaAleatoria() {
  const vSenhaAleatorio = Math.floor(Math.random() * 99999999999999)
  const hash = await bcrypt.hash(vSenhaAleatorio.toString(), 10)
  return hash
}

function calcularTempoPermanencia(dataEntrada, dataSaida) {
  const dataEntradaMoment = moment(dataEntrada)
  const dataSaidaMoment = moment(dataSaida)

  const diferencaDatas = moment.duration(dataSaidaMoment.diff(dataEntradaMoment))

  const diferencaEmHoras = parseInt(diferencaDatas.asHours(), 0)

  const minutosBlocados = diferencaEmHoras * 60

  const diferencaEmMinutos = parseInt(diferencaDatas.asMinutes(), 0)

  const diferencaResidualMinutos = diferencaEmMinutos - minutosBlocados

  const tempoTotalDiferenca = diferencaEmHoras.toString().padStart(2, '0') + ':' + diferencaResidualMinutos.toString().padStart(2, '0')

  return tempoTotalDiferenca
}

function formatarData(pData) {
  return moment(pData).format('DD/MM/YYYY HH:mm')
}

function ordenar(array, ordernacao, direcao) {
  return direcao === 'DESC' ?
    (array.reverse((a, b) => {
      var x = a[ordernacao]; var y = b[ordernacao];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })) :
    (array.sort((a, b) => {
      var x = a[ordernacao]; var y = b[ordernacao];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }))
}

function excluirDuplicadosArray(pArray, pCampos) {
  const semDuplicidade = []
  pArray.forEach((item) => {
    const duplicado = semDuplicidade.findIndex((redItem) => {
      let vIgual = true
      pCampos.forEach((campo) => {
        if (item[campo] !== redItem[campo]) vIgual = false
      })
      return vIgual
    }) > -1

    if (!duplicado) {
      semDuplicidade.push(item)
    }
  })
  return semDuplicidade
}

const functions = {
  obterDataCorrente: () => obterDataCorrente(),
  converterParaData: (pDataString) => converterParaData(pDataString),
  obterDia: (pData) => obterDia(pData),
  diferencaData: (pDataInicio, pDataFim) => diferencaData(pDataInicio, pDataFim),
  dataValida: (pData) => dataValida(pData),
  obterSequencia: (nomeColuna) => obterSequencia(nomeColuna),
  gerarSequencia: (nomeColuna) => gerarSequencia(nomeColuna),
  gerarUUID: (pChave) => gerarUUID(pChave),
  gerarSenhaAleatoria: () => gerarSenhaAleatoria(),
  calcularTempoPermanencia: (dataEntrada, dataSaida) => calcularTempoPermanencia(dataEntrada, dataSaida),
  formatarData: (pData) => formatarData(pData),
  ordenar: (array, ordernacao, direcao) => ordenar(array, ordernacao, direcao),
  excluirDuplicadosArray: (pArray, pCampos) => excluirDuplicadosArray(pArray, pCampos),
}

export default functions
