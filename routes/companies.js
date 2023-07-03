const express = require("express");
const router = express.Router();
const db = require("../db");



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
        const { code } = req.params;
        const compResults = await db.query(
            `SELECT name, description FROM companies WHERE code=$1`, [code]
        );
        const invResults = await db.query(`
            SELECT (id, amt, paid, paid_date) FROM 
            invoices WHERE comp_code = $1`, [code]);

            const company = compResults.rows[0];
            company.invoices = invResults.rows;
            return res.json(company);
    } catch (err) {
        return next(err);
    }
});


router.post('/companies', async function(req, res, next){
    try {
        const {code, name, description} = req.body;
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) 
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