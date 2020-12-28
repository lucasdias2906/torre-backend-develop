// importantado o mongo e o schema
import mongoose from 'mongoose';
mongoose.pluralize(null);

var parceiroClassificacaoSchema = new mongoose.Schema({
    identificacaoClassificacao: { type: Number, unique: true, required: [true, 'Informe o código do parceiro comercial.'] },
    descricaoClassificacao: { type: String, required: [true, 'Informe o tempo limite de aceite.'] },
    log:
    {
        usuarioInclusao: { type: String, required: true },
        usuarioAlteracao: { type: String, required: true },
        dataInclusao: { type: Date, required: [false, 'Informe a data criação.'] },
        dataAlteracao: { type: Date, required: [false, 'Informe a data alteração.'] }
    }
},
    {
        // strict: 'throw',
        versionKey: false, timestamps: { createdAt: 'dataInclusao', updatedAt: 'dataAlteracao' }
    }
);

parceiroClassificacaoSchema.index({ identificacaoClassificacao: 1, descricaoClassificacao: 1 }, { unique: true })

var parceiroClassificacaoSchema = mongoose.model('torreParceiroClassificacao', parceiroClassificacaoSchema);

module.exports = parceiroClassificacaoSchema;