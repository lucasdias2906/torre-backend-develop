import mongoose from 'mongoose'

mongoose.pluralize(null)

const enumStatusRotinaLog = Object.freeze({
  ERRO: 'E', // Erro
  PROCESSADO: 'P', // OK
})

const rotinaLogSchema = new mongoose.Schema(
  {
    observacao: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(enumStatusRotinaLog),
      required: false,
    },
    rotinaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'torreRotina',
      required: false,
    //  validate: {
    //    async validator(v) {
    //      const rotina = await Rotina.findById(v, (rec) => rec !== null)
    //       return rotina
    //    },
    //    message: 'Rotina informada não existe!',
    //  },
    },
    log: {
      dataInclusao: { type: Date, required: true },
      usuarioInclusao: { type: String, required: true },
      dataAlteracao: { type: Date, required: true },
      usuarioAlteracao: { type: String, required: true },
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'log.dataInclusao',
      updatedAt: 'log.dataAlteracao',
    },
  },
)


const rotinaLogModel = mongoose.model(
  'torreRotinaLog',
  rotinaLogSchema,
)

module.exports = rotinaLogModel
