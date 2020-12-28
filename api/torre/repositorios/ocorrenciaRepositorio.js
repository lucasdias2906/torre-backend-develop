import BaseRepositorio from './base/baseRepositorio'
import Ocorrencia from '../modelos/ocorrencia'

import utilitarios from '../funcoes/utilitarios'

export default class ocorrenciaRepositorio {
  constructor() {
    this.baseRepositorio = new BaseRepositorio('torreOcorrencia')
  }

  async obter(id) {
    return this.baseRepositorio.obter(id)
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async incluir(body) {
    const ocorrencia = new Ocorrencia(body)
    return this.baseRepositorio.incluir(ocorrencia)
  }

  // verifica se existe a ocorrência para não inserir duplicado
  async VerificarOcorrenciaExiste(pOrigem, pTipoOcorrenciaId, pChave, pStatus, pPrioridade, pClassificacao, pDataOcorrencia, pParceiroComercial) {
    const vDataOcorrenciaDia = utilitarios.obterDia(pDataOcorrencia)
    const vDataOcorrenciaDiaMaisUm = vDataOcorrenciaDia.clone().add(1, 'day')

    const vFiltro = {
      origem: pOrigem,
      tipoOcorrenciaId: pTipoOcorrenciaId,
      status: pStatus,
      prioridade: pPrioridade,
      classificacao: pClassificacao,
      dataOcorrencia: { $gte: vDataOcorrenciaDia, $lt: vDataOcorrenciaDiaMaisUm },
    }

    if (pOrigem === 'PEDIDO') {
      vFiltro['pedido.numero'] = pChave
      vFiltro['pedido.parceiroComercial'] = pParceiroComercial
    } else if (pOrigem === 'VEICULO') {
      vFiltro['veiculo.codigo'] = pChave
    } else if (pOrigem === 'MOTORISTA') {
      vFiltro['motorista.codigo'] = pChave
    }

    const ocorrencia = await this.baseRepositorio.obterUm(vFiltro)
    return ocorrencia.dados
  }

  async alterar(vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }
}
