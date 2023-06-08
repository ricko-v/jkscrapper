const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const request = require("request");
const co = require("cheerio");

const r = Router();

r.get('/', (req, res) => {
    let q = req.query.q;
    let n = req.query.page ? Number(req.query.page) : 1;
    let listKata = [];

    if (!q) {
        res.json(new SuccessResponseObject('success uy', 'Query q nya mana uy'));
    } else {
        request(`https://jagokata.com/kata-bijak/kata-${q.replace(/[' ']/g, '+')}.html?page=${n}`, (e, re, b) => {
            if (e) res.json(new ErrorResponseObject('error uy', JSON.stringify(e)));
            let $ = co.load(b);
            let paginate = $('body').find('.paginate').text();
            let a = $('body').find('.paginate > strong').last().text();
            let last = Number(a) % 10 == 0 ? Number(a) / 10 : (Number(a) - (Number(a) % 10)) / 10 + 1

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

            res.json(new SuccessResponseObject('success uy', {
                currentPaginate: n,
                lastPaginate: last,
                paginate: paginate,
                next: n != last,
                result: listKata
            }));
        });

    }
});

module.exports = r;
