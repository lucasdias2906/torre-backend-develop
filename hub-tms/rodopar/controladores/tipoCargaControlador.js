const express = require('express');
const tipocargaServico = require('../servicos/tipoCargaServico');

const router = express.Router();

router.get('/', function(req, res) {
    tipocargaServico
        .listar(req, res)
        .then(result => {
            console.log('tipo carga - controlador');
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

router.get('/:pTpCargaId', function(req, res) {
    tipocargaServico
        .obter(req.params.pTpCargaId)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

module.exports = router;
