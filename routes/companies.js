const express = require("express");
const db = require("../db");
const slugify = require("slugify");
const ExpressError = require("../expressError");

const router = express.Router();


app.use(express.json());

router.get('/companies', async function(req, res, next){
    try {
        const results = await db.query(
            `SELECT * FROM companies`
        );
        return res.json(results.rows);
    }
    catch (err) {
        return next(err);
    }
});



router.get('/companies/:code', async function(req, res, next){
    try {        
        const compResults = await db.query(
            `SELECT c.code, c.name, c.description, i.industry
                FROM companies AS c
                    LEFT JOIN companies_industries AS ci
                        ON c.code = ci.comp_code
                    LEFT JOIN industries AS i ON ci.industry_code = i.code
                WHERE c.code = $1;`,
            [req.params.code]            
        );
        
        const invoiceResults = await db.query(
            `SELECT * FROM 
            invoices WHERE comp_code = $1`, [req.params.code]);       

            let { code, name, description } = compResults.rows[0];
            let industries = compResults.rows.map(r => r.industry);
            let invoices = invoiceResults.rows.map(r => {r.id, r.amt});
            
            return res.json({ code, name, description, industries, invoices });
    } 
    catch (err) {
        return next(err);
    }
});


router.post('/companies', async function(req, res, next){
    try {
        const {name, description} = req.body;
        const code = slugify(name);
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES (${code}, $1, $2) 
        RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json(results.rows[0]);
    } catch (err) {
        return next(err);
    }
});


router.put('/companies/:code', async function(req, res, next){
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 
        RETURNING code, name, description`, [name, description, code]);
        return res.json(results.rows[0]);
    } catch (err) {
        return next(err);
    }
});



router.delete('/companies/:code', async function(req, res, next){
    try {
        const { code } = req.params;
        const results = await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
        return res.send({ msg: "DELETED!" });
    } catch (err) {
        return next(err);
    }
})







module.exports = router;