const dottie = require('dottie')
const db = require('../modelos')

module.exports = {
  async executarSQLListar(pParams, pSql, pClausulaWhere, pOrdenacao) {
    if (!pSql) { throw Error('(executarSQLListar) Consulta SQL não informada! ') }

    const vPagina = pParams.pagina || 1
    const vLimite = pParams.limite || 1000000

    let vDirecao = 'asc'

    if (pParams.direcao && pParams.direcao.toLowerCase() === 'desc') { vDirecao = 'desc' }

    let vSql = pSql

    if (pClausulaWhere) vSql = vSql.replace('@@FILTRO@@', ` ${pClausulaWhere}`)
    else vSql = vSql.replace('@@FILTRO@@', '')

    if (pOrdenacao) {
      vSql = vSql.replace(
        '@@ORDENACAO@@',
        ` ORDER BY ${pOrdenacao} ${vDirecao}`,
      )
      vSql = vSql.replace(
        '@@ORDENACAOLINHA@@',
        `ROW_NUMBER() OVER(ORDER BY ${pOrdenacao} ${vDirecao}) numeroLinha,`,
      )
    } else {
      vSql = vSql.replace('@@ORDENACAO@@', 'numeroLinha')
      vSql = vSql.replace('@@ORDENACAOLINHA@@', '1 numeroLinha,')
    }

    // incluindo a paginação
    vSql = `SELECT * FROM (${vSql}) x `
    const vSqlContagemTotal = `SELECT COUNT(1) quantidadeTotal FROM (${vSql}) x `

    // somente faz paginação se informado o limite
    if (vLimite) {
      const vInicio = (vPagina - 1) * vLimite + 1
      const vFim = vPagina * vLimite
      vSql += ` WHERE x.numeroLinha between ${vInicio} and ${vFim}`
    }

    if (pOrdenacao) vSql += ' ORDER BY x.numeroLinha'

    const vRetorno = await db.sequelize.query(vSql, {
      replacements: null,
      type: db.sequelize.QueryTypes.SELECT,
    })

    const vRetornoContagem = await db.sequelize.query(vSqlContagemTotal, {
      replacements: null,
      type: db.sequelize.QueryTypes.SELECT,
    })

    return {
      totalRegistros: vRetornoContagem[0].quantidadeTotal,
      totalRegistrosPagina: vRetorno.length,
      dados: dottie.transform(vRetorno),
    }
  },

  async executarSQLObter(pSql, pId) {
    if (!pSql) { throw Error('(executarSQLObter) Consulta SQL não informada! ') }

    const vRetorno = await db.sequelize.query(pSql, {
      replacements: { pId },
      type: db.sequelize.QueryTypes.SELECT,
    })

    let vDados = null

    if (vRetorno.length > 0) [vDados] = dottie.transform(vRetorno)

    return {
      dados: vDados,
    }
  },

  async executarSQL(pSql, pParams) {
    let vRetorno = null

    if (!pSql) { throw Error('(executarSQL) Procedure não informada! ') }

    if (pParams) {
      vRetorno = await db.sequelize.query(pSql, {
        replacements: pParams,
      })
    } else {
      vRetorno = await db.sequelize.query(pSql)
    }

    let vDados = null

    if (vRetorno.length > 0) [vDados] = dottie.transform(vRetorno)

    return {
      dados: vDados,
    }
  },
}
