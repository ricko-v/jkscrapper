const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const request = require("request");
const co = require("cheerio");

const r = Router();

r.get('/', (req, res) => {
    request('https://jagokata.com/tokoh/semua-tokoh.html', (e, re, b) => {
        if (e) throw e;
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

});

module.exports = r;