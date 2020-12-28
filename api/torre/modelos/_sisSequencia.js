// importantado o mongo e o schema
import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Tokens  ( a princípio somente tokens Inativados)
module.exports = mongoose.model('sisSequencia', new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true },
  },
  {
    // strict: 'throw',
    versionKey: false,
  },
));
