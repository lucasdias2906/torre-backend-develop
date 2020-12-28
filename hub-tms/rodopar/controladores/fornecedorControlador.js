import express from 'express';
import fornecedorServico from '../servicos/fornecedorServico';

const router = express.Router();

router.get('/', function(req, res) {
    console.log('Listar fornecedor - Controler');
    fornecedorServico
        .listaFornecedor(req)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

router.get('/:pCodigoFornecedor', function(req, res) {
    console.log('Listar detalhes parceiro - Controler');
    fornecedorServico
        .listarDetalhes(req.params.pCodigoFornecedor, req)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

export default router;
