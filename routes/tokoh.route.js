const { Router } = require('express');
const { SuccessResponseObject, ErrorResponseObject } = require('../common/http');
const request = require("request");
const co = require("cheerio");

const r = Router();

r.get('/', (req, res) => {
    let slug = req.query.slug;
    let n = req.query.page ? Number(req.query.page) : 1;

    if (!slug) {
        res.json(new SuccessResponseObject('success uy', 'Query slug nya mana uy'));
    } else {
        request(`https://jagokata.com/kata-bijak/dari-${slug.replace(/[' ']/g, '+')}.html?page=${n}`, (e, re, b) => {
            if (e) res.json(new ErrorResponseObject('error uy', JSON.stringify(e)));
            let $ = co.load(b);
            let paginate = $('body').find('.paginate').first().text();
            let a = $('body').find('.paginate > strong').last().text();
            let last = Number(a) % 10 == 0 ? Number(a) / 10 : (Number(a) - (Number(a) % 10)) / 10 + 1
            let listKata = [];

            let namaBiografy = $('body').find('.auteur-beschrijving-content > h2').text();
            let keteranganBiografy = $('body').find('.auteur-beschrijving-content > p').first().text();

            $("body").find("#citatenrijen > li").each(function () {
                let q = $(this).find("q").text();
                let sumber = $(this).find('.bron-citaat').text();
                if (q !== '') {
                    listKata.push({
                        q: q,
                        sumber: sumber.trim()
                    })
                }
            });

            res.json(new SuccessResponseObject('success uy', {
                currentPaginate: n,
                lastPaginate: last,
                paginate: paginate,
                next: n != last,
                biografi: {
                    nama: namaBiografy,
                    keterangan: keteranganBiografy
                },
                result: listKata
            }));
        });
    }
});

module.exports = r