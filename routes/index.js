const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const kategori = require('./kategori.route');
const negara = require('./negara.route');

const r = Router();

r.use('/kategori', kategori);
r.use('/negara', negara);

r.get('/', (req, res) => res.json(new SuccessResponseObject('built by ricko-v')));

module.exports = r;
