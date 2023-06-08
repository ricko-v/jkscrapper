const { Router } = require('express');
const { SuccessResponseObject, ErrorResponseObject } = require('../common/http');
const request = require("request");
const co = require("cheerio");

const r = Router();

r.get('/', (req, res) => {
    request("https://jagokata.com/kata-bijak/acak.html", (e, re, b) => {
        if (e) res.json(new ErrorResponseObject('error uy', JSON.stringify(e)));
        let $ = co.load(b);
        let listKata = [];

        $('body').find("#citatenrijen > li").each(function () {
            let kata = $(this).find('q').text();
            let nama = $(this).find('.citatenlijst-auteur > a').text();
            let keterangan = $(this).find('.citatenlijst-auteur > .auteur-beschrijving').text();
            let sumber = $(this).find('.bron-citaat').text().trim();

            if (kata !== '') {
                listKata.push({
                    q: kata,
                    nama: nama,
                    keterangan: keterangan,
                    sumber: sumber
                })
            }
        });
        res.json(new SuccessResponseObject('success uy', listKata));
    })
});

module.exports = r;