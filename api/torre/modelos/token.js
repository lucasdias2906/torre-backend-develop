import mongoose from 'mongoose';

mongoose.pluralize(null);

const Schema = mongoose.Schema;

// Tokens  ( a princípio somente tokens Inativados)
module.exports = mongoose.model('torreToken', new Schema(
  {
    token: { type: String, required: true }, // token
    dataInativacao: { type: Date, required: false },
    status: { type: String, required: true }, // status , a princípio, somente tokens inativados para logof
  },
  { //strict: 'throw' ,
    versionKey: false,
  },
));
