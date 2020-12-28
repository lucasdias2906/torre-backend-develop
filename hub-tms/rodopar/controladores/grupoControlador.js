const express = require('express');
const grupoServico = require('../servicos/grupoServico');

const router = express.Router();

router.get('/', function(req, res) {
    grupoServico
        .listar(req, res)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

router.get('/:pGrupoId', function(req, res) {
    grupoServico
        .obter(req.params.pGrupoId)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

router.get('/:pGrupoId/empresa', function(req, res) {
    grupoServico
        .listarEmpresas(req, req.params.pGrupoId)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

module.exports = router;
