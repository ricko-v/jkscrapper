const { Router } = require('express');
const { SuccessResponseObject, ErrorResponseObject } = require('../common/http');
const request = require("request");
const co = require("cheerio");

const r = Router();

r.get('/', (req, res) => {
    let negara = req.query.slug;
    let n = req.query.page ? Number(req.query.page) : 1;

    if (negara) {
        request(`https://jagokata.com/tokoh/${negara}.html?page=${n}`, (e, re, b) => {
            if (e) res.json(new ErrorResponseObject('error uy', JSON.stringify(e)));
            let $ = co.load(b);
            let paginate = $('body').find('.paginate').first().text();
            let a = $('body').find('.paginate > strong').last().text();
            let last = Number(a) % 100 == 0 ? Number(a) / 100 : (Number(a) - (Number(a) % 100)) / 100 + 1
            let listTokoh = [];

            $("body").find(".auteur-lijst > li").each(function () {
                let slug = $(this).find('a').attr('href');
                let nama = $(this).find('a > img').attr('alt');
                let keterangan = $(this).find('a > .auteur-beschrijving').text();
                listTokoh.push({
                    nama: nama,
                    keterangan: keterangan,
                    slug: slug.slice(37, slug.length - 5)
                })
            })

            res.json(new SuccessResponseObject('success uy', {
                currentPaginate: n,
                lastPaginate: last,
                paginate: paginate,
                next: n != last,
                result: listTokoh
            }));
        });
    } else {
        request('https://jagokata.com/tokoh/semua-tokoh.html', (e, re, b) => {
            if (e) res.json(new ErrorResponseObject('error uy', JSON.stringify(e)));;
            let listNegara = [];
            let $ = co.load(b);
            $('body').find('#auteur-categorie > ul').last().each(function () {
                $(this).find('li').each(function () {
                    let slug = $(this).find('a').attr('href');
                    let title = $(this).text();

                    if (slug) {
                        listNegara.push({
                            slug: slug.slice(6, slug.length - 5),
                            title: title
                        })
                    }
                })
            });

            res.json(new SuccessResponseObject('success uy', listNegara));
        });
    }
});

module.exports = r;
