const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const kategori = require('./kategori.route');
const negara = require('./negara.route');
const cari = require("./cari.route");
const acak = require("./acak.route");
const tokoh = require("./tokoh.route");

const r = Router();

r.use('/kategori', kategori);
r.use('/negara', negara);
r.use('/cari', cari);
r.use('/acak', acak);
r.use('/tokoh', tokoh);

r.get('/', (req, res) => res.json(new SuccessResponseObject('built by ricko-v', {
    listRoute: [
        {
            path: '/kategori',
            query: ['slug', 'page']
        },
        {
            path: '/negara',
            query: ['slug', 'page']
        },
        {
            path: '/tokoh',
            query: ['slug', 'page']
        },
        {
            path: '/cari',
            query: ['q', 'page']
        },
        {
            path: '/acak',
            query: []
        },
    ]
})));

module.exports = r;
