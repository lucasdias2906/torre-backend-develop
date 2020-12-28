import mongoose from 'mongoose'
import logRepositorio from './logRepositorio';
import BaseErro from '../../servicos/base/baseErro';

export default class baseRepositorio {
  constructor (model) {
    this._model = mongoose.model(model)
  }

  getModel() {
    return this._model
  }

  async incluirLog(data, pOptions) {
    const modelo = new this._model(data)
    const resultado = await modelo.save(pOptions)
    return { dados: resultado }
  }

  async incluir(data, pOptions) {
    const modelo = new this._model(data)
    modelo.log.dataInclusao = new Date()
    modelo.log.usuarioInclusao = global.usuarioLogin ? global.usuarioLogin.login : 'N/A'
    modelo.log.dataAlteracao = new Date()
    modelo.log.usuarioAlteracao = global.usuarioLogin ? global.usuarioLogin.login : 'N/A'
    const resultado = await modelo.save(pOptions)
    await logRepositorio.logIncluir(modelo, pOptions, 'I')
    return { dados: resultado }
  }

  async alterar(id, data, pOptions) {
    delete data.dataInclusao
    delete data.usuarioInclusao
    data['log.dataAlteracao'] = new Date()
    data['log.usuarioAlteracao'] = global.usuarioLogin ? global.usuarioLogin.login : 'N/A'
    const vRetornoUpdate = await this._model.updateOne({ _id: id }, { $set: data }, pOptions)
    if (vRetornoUpdate.nModified <= 0) throw new BaseErro(400, 'genericoNenhumRegistroAlterado')
    const resultado = await this._model.findById(id)
    await logRepositorio.logIncluir(resultado, pOptions, 'A')
    return { dados: resultado }
  }

  async alterarUm(pFiltro, data, pOptions) {
    if (!pOptions) pOptions = {}
    pOptions.new = true
    pOptions.runValidators = true

    delete data.dataInclusao
    delete data.usuarioInclusao
    data['log.dataAlteracao'] = new Date()
    data['log.usuarioAlteracao'] = global.usuarioLogin ? global.usuarioLogin.login : 'N/A'
    const vRetornoUpdate = await this._model.updateOne(pFiltro, { $set: data }, pOptions)
    if (vRetornoUpdate.nModified <= 0) throw new BaseErro(400, 'genericoNenhumRegistroAlterado')
    const resultado = await this._model.findOne(pFiltro)
    await logRepositorio.logIncluir(resultado, pOptions, 'A')
    return { dados: resultado }
  }

  async listar(pParams, pFiltro) {
    let vPagina = pParams.pagina ? Number(pParams.pagina) - 1 : 0
    if (vPagina < 0) vPagina = 0

    const vLimite = pParams.limite ? Number(pParams.limite) : 100
    let vOrdenacao = pParams.ordenacao ? pParams.ordenacao : ''
    const vDirecao = pParams.direcao ? pParams.direcao : 'ASC'
    const vPopulate = pParams.populate ? pParams.populate : ''

    if (vDirecao.toLowerCase() === 'desc') vOrdenacao = `-${vOrdenacao}`

    const vSkip = vPagina * vLimite

    const vRegistrosTotal = await this._model.countDocuments(pFiltro)
    const vRegistros = await this._model.find(pFiltro).populate(vPopulate).sort(vOrdenacao).limit(vLimite).skip(vSkip)

    return {
      totalRegistros: vRegistrosTotal,
      totalRegistrosPagina: vRegistros.length,
      dados: vRegistros,
    };
  }

  // versão apenas com um parâmetro, "migrar listarV2 para listar?"
  async listarV2(pParams) {
    let vPagina = pParams.pagina ? Number(pParams.pagina) - 1 : 0
    if (vPagina < 0) vPagina = 0

    const vLimite = pParams.limite ? Number(pParams.limite) : 100
    let vOrdenacao = pParams.ordenacao ? pParams.ordenacao : ''
    const vDirecao = pParams.direcao ? pParams.direcao : 'ASC'
    const vPopulate = pParams.populate ? pParams.populate : ''

    if (vDirecao.toLowerCase() === 'desc') vOrdenacao = `-${vOrdenacao}`

    const vSkip = vPagina * vLimite;

    const vFiltro = pParams.filtro === undefined ? {} : pParams.filtro

    const vRegistrosTotal = await this._model.find(vFiltro)
    const vRegistros = await this._model.find(vFiltro).populate(vPopulate).sort(vOrdenacao).limit(vLimite).skip(vSkip)

    return {
      totalRegistros: vRegistrosTotal.length,
      totalRegistrosPagina: vRegistros.length,
      dados: vRegistros,
    }
  }

  async listarDistinct(pFiltro, pField) {
    return await this._model.find(pFiltro).distinct(pField)
  }

  async obter(id) {
    const vRetorno = await this._model.findById(id)
    return { dados: vRetorno }
  }

  async obterUm(pParams) {
    const vRetorno = await this._model.findOne(pParams)
    return { dados: vRetorno }
  }

  // usa a função agreggate do mongo para listagem
  async agregar(pParams) {
    let vPagina = pParams.pagina ? Number(pParams.pagina) - 1 : 0
    if (vPagina < 0) vPagina = 0

    let vDirecao = pParams.direcao ? pParams.direcao : 'asc'
    vDirecao = (vDirecao.toLowerCase() === 'desc') ? '-1' : '1'
    const vLimite = pParams.limite ? Number(pParams.limite) : 100
    const vOrdenacao = pParams.ordenacao ? `{ '${pParams.ordenacao}': ${vDirecao} }` : { x: 1 }

    const vSkip = vPagina * vLimite

    // adiciona uma cláusula específica para agregação
    const vInstrucao = []
    if (pParams.instrucao) {
      for (let i = 0; i < pParams.instrucao.length; i += 1) {
        vInstrucao.push(pParams.instrucao[i])
      }
    }

    const vRegistrosTotal = await this._model.aggregate(vInstrucao)

    vInstrucao.push({ $skip: vSkip })
    vInstrucao.push({ $limit: vLimite })
    vInstrucao.push({ $sort: vOrdenacao })

    const vRegistros = await this._model.aggregate(vInstrucao)

    return {
      totalRegistros: vRegistrosTotal.length,
      totalRegistrosPagina: vRegistros.length,
      dados: vRegistros,
    }
  }

  async excluir(id, pOptions) {
    const vRetorno = await this._model.findByIdAndRemove(id, pOptions)
    if (!vRetorno) throw new BaseErro(400, 'genericoNenhumRegistroExcluido')
    return vRetorno
  }

  async excluirVarios(pParams, pOptions) {
    return this._model.deleteMany(pParams, pOptions)
  }
}
