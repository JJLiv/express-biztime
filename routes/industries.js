const express = require("express");
const db = require("../db");
const slugify = require("slugify");
const ExpressError = require("../expressError");

const router = express.Router();

app.use(express.json());

app.get('/industries', async function(req, res, next){
    try {
        let results = await db.query(
            `SELECT i.industry, c.comp_code 
                FROM industries AS i
                    LEFT JOIN companies_industries AS ci
                        ON i.code = ci.industry_code
                    LEFT JOIN companies AS c
                ON ci.comp_code = c.code`
        );
        let industries = results.rows.map(r => {r.industry, results.rows.map(r => r.comp_code)});
        
        return res.json(industries);

    } catch (err) {
        return next(err);
    }
});

app.post('/industries', async function(req, res, next){
    try {
        const result = await db.query(
            `INSERT INTO industries (code, industry) VALUES ($1, $2) 
            RETURNING code, industry`, [code, industry]
        );
        let industry = result.rows[0];
        return res.json(industry);
    } catch(err) {
        return next(err);
    }
});