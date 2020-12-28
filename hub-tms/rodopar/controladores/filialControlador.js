import express from 'express';

import filialServico from '../servicos/filialServico';

const router = express.Router();

router.get('/', function(req, res) {
    filialServico
        .listar(req, res)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

router.get('/:pFilialCodigo', function(req, res) {
    filialServico
        .obter(req.params.pFilialCodigo)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

export default router;
