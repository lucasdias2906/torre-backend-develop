const express = require('express');
const usuarioServico = require('../servicos/usuarioServico');
// import { check, validationResult } from 'express-validator/check';

const router = express.Router();

// Rotas
router.get('/obtemPorLogin/:pLogin', function(req, res) {
    usuarioServico
        .obtemPorLogin(req.params.pLogin)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ menssagem: err });
        });
});

router.get('/obtemPorLogin/:pLogin/empresa/:pEmpresaId', function(req, res) {
    usuarioServico
        .listarEmpresas(req.params.pLogin, req.params.pEmpresaId)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

router.get('/obtemPorLogin/:pLogin/empresa/:pEmpresaId/filial', function(
    req,
    res
) {
    usuarioServico
        .listarFiliais(req.params.pLogin, req.params.pEmpresaId)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
});

module.exports = router;
