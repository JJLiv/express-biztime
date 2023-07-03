const express = require('express');
const router = express.Router();
const db = require("../db");



app.use(express.json());


app.get('/invoices', async function(req, res, next){
    try {
        const results = await db.query(`
        SELECT * FROM invoices`);
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});


app.get('/invoices/:id', async function(req, res, next){
    try {
        const { id } = req.params;
        const results = await db.query(`
        SELECT (comp_code, amt, paid, paid_date) FROM invoices WHERE 
        id=$1`, [id]);
        return res.json(results.rows);
    } catch (err) {
        return next(err);
    }
});


app.post('/invoices', async function(req, res, next){
    try {
        const { comp_code, amt, paid, paid_date } = req.body;
        const results = await db.query(`
        INSERT INTO invoices (comp_code, amt, paid, paid_date) 
        VALUES ($1, $2, $3, $4) RETURNING comp_code, amt, paid, paid_date`, 
        [comp_code, amt, paid, paid_date]);
        return res.status(201).json(results.rows[0]);
    } catch (err) {
        return next(err);
    }
});


app.put('/invoices/:id', async function(req, res, next){
    try {
        const { id } = req.params;
        const { comp_code, amt, paid, paid_date } = req.body;
        const results = await db.query(`UPDATE invoices SET comp_code=$1, amt=$2, 
        paid=$3, paid_date=$4 WHERE id=$5 
        RETURNING comp_code, amt, paid, paid_date`, [comp_code, amt, paid, paid_date, id]);
        return res.json(results.row[0]);
    } catch (err) {
        return next(err);
    }
});


app.delete('/invoices/:id', async function(req, res, next){
    try {
        const { id } = req.params;
        const results = await db.query(`DELETE FROM invoices WHERE 
        id=$1`, [id]);
        return res.send({msg : "DELETED"});
    } catch (err) {
        return next(err);
    }
});





module.exports = router;