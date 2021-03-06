const OCORRENCIA = {
  ALOCACAO_VEICULO_MOTORISTA_DENTRO_PRAZO: 1,
  ALOCACAO_VEICULO_MOTORISTA_TEMPO_EXCEDIDO: 2,
  RASTREADOR_CAVALO_SEM_COMUNICACAO: 3,
  RASTREADOR_CARRETA_SEM_COMUNICACAO: 4,
  ATRASO_CHEGADA_AREA_COLETA: 5,
  REGISTRO_ENTRADA_AREA_COLETA: 6,
  TEMPO_EXCEDIDO_AREA_COLETA: 7,
  REGISTRO_SAIDA_AREA_COLETA: 8,
  ATRASO_CHEGADA_AREA_ENTREGA: 9,
  REGISTRO_ENTRADA_AREA_ENTREGA: 10,
  TEMPO_EXCEDIDO_AREA_ENTREGA: 11,
  REGISTRO_SAIDA_AREA_ENTREGA: 12,
  REGISTRO_FIM_VIAGEM: 13,
  SM_NAO_INTEGRADA: 18,
  ALERTA_FERIAS_MOTORISTA: 19,
  VENCIMENTO_CNH_MOTORISTA: 20,
  OCORRENCIA_EM_ABERTO_TEMPO_EXCEDIDO: 21,
  ACAO_DE_OCORRENCIA_TEMPO_EXCEDIDO: 22,
  CONFIRMACAO_ALOCACAO_PEDIDO: 24,
  MOTORISTA_SEM_ALOCACAO_POR_TEMPO: 25,
  BAIXA_DA_PV_EFETUADA_PELA_TORRE: 26,
  RASTREADOR_PEDIDO_CAVALO_SEM_COMUNICACAO: 27,
  RASTREADOR_PEDIDO_CARRETA_SEM_COMUNICACAO: 28,
  TEMPO_AGUARDANDO_NO_PATIO_DENTRO_PRAZO: 38,
  TEMPO_AGUARDANDO_NO_PATIO_EXCEDIDO: 39,
  TEMPO_CARREGAMENTO_DENTRO_PRAZO: 40,
  TEMPO_CARREGAMENTO_EXCEDIDO: 41,
  TEMPO_EMISSAO_DENTRO_PRAZO: 42,
  TEMPO_EMISSAO_EXCEDIDO: 43,
  TEMPO_DESCARGA_DENTRO_PRAZO: 44,
  TEMPO_DESCARGA_EXCEDIDO: 45,
  TEMPO_FORNECEDOR_DENTRO_PRAZO: 46,
  TEMPO_FORNECEDOR_EXCEDIDO: 47,
  TEMPO_FREE_TIME_CLIENTE_DENTRO_PRAZO: 48,
  TEMPO_FREE_TIME_CLIENTE_EXCEDIDO: 49,
  TEMPO_MAXIMO_CLIENTE_DENTRO_PRAZO: 50,
  TEMPO_MAXIMO_CLIENTE_EXCEDIDO: 51,
  ENTREGA_DENTRO_PRAZO: 52,
  ENTREGA_PRAZO_EXCEDIDO: 53,
  VEICULO_CHEGOU_DESTINO_CLIENTE: 55,
}

const TIPO_POLIGONO_VERIFICACAO = {
  COLETA: 'COLETA',
  ENTREGA: 'ENTREGA',
  CHECKPOINT: 'CHECKPOINT',
}

const PARAMETROS_GRUPO = {
  MONITORAMENTO: 'monitoramento',
}

const PARAMETROS = {
  TEMPO_PADRAO_CARREGAMENTO: 'TEMPO_PADRAO_CARREGAMENTO',
  TEMPO_PADRAO_DESCARGA: 'TEMPO_PADRAO_DESCARGA',
  PRAZO_VERIFICACAO_ALOCACAO_VEICULO: 'PRAZO_VERIFICACAO_ALOCACAO_VEICULO',
  PRAZO_LIMITE_ALOCACAO_VEICULO: 'PRAZO_LIMITE_ALOCACAO_VEICULO',
  PRAZO_VERIFICACAO_CAVALO: 'PRAZO_VERIFICACAO_CAVALO',
  PRAZO_VERIFICACAO_CARRETA: 'PRAZO_VERIFICACAO_CARRETA',
  EMAILS_ADMINISTRATIVOS_TORRE: 'EMAILS_ADMINISTRATIVOS_TORRE',
  HORARIO_INICIO_MONITORAMENTO: 'HORARIO_INICIO_MONITORAMENTO',
  HORARIO_TERMINO_MONITORAMENTO: 'HORARIO_TERMINO_MONITORAMENTO',
  ITEM_MONITORAMENTO_RASTREADOR: 'ITEM_MONITORAMENTO_RASTREADOR',
}

module.exports = {
  OCORRENCIA,
  TIPO_POLIGONO_VERIFICACAO,
  PARAMETROS,
  PARAMETROS_GRUPO,
}
