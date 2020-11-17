const express = require('express');
const router = express.Router();
// JSON DB
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

// JSON DB MIDDLEWARE
// https://www.npmjs.com/package/node-json-db
const db = new JsonDB(new Config('./data/db', true, false, '/'));

// GET HOME
router.get('/', (req, res) => {
    try {
        // GET ALL DATA FROM JSON DB
        let data = db.getData('/quotes');

        // RETURN JSON
        // return res.status(200)
        //     .json({
        //         success: true,
        //         data
        //     });

        // RETURN HTML
        res.render('index.ejs', {
            data: JSON.stringify(data)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something really bad happened! 😱 ${error}` })
    };
});
// GET FROM PATH SINGLE QUOTE
router.get('/:id', (req, res) => {
    try {
        // GET ALL DATA
        let id = +req.params.id;
        // console.log(id);

        // GET INDEX OF
        let index = db.getIndex("/quotes", id);
        // console.log(index)

        // GET ITEM IN THE ARRAY
        let data = db.getData(`/quotes[${index}]`);

        // If ids do not match
        if (data.id !== id) {
            data = {
                id: undefined,
                quote: undefined,
                author: undefined,
                like: undefined
            }
        }

        // RETURN JSON
        // return res.status(200)
        //     .json({
        //         success: true,
        //         data
        //     });

        // RETURN HTML Array
        res.render('index.ejs', {
            data: JSON.stringify([data])
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something really bad happened! 😱 ${error}` })
    };
});

// POST PUSH NEW QUOTE
router.post('/', (req, res) => {
    try {
        // Quote and author
        let quote = req.body.quote;
        let author = req.body.author;
        let like = req.body.like;

        // FIND LAST ITEM ID
        let lastQuote = db.getData("/quotes[-1]").id;
        // CREATE OBJECT TO PUSH WITH ID
        let quoteObj = {
            id: ++lastQuote,
            quote,
            author,
            like
        };
        // PUSH AND SAVE
        db.push("/quotes[]", quoteObj, true);

        // COUNT
        let count = db.count('/quotes');
        // GET
        let data = db.getData('/');

        // RETURN
        return res.status(200)
            .json({
                success: true,
                data,
                count
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something really bad happened! 😱 ${error}` });
    };
});


// UPDATE
router.post('/update/:id', (req, res) => {
    try {
        let id = +req.params.id;
        // console.log(id);
        // Define variables
        let quote = req.body.quote.replace(/['"]+/g, '');
        let author = req.body.author;
        let like = +req.body.like;
        // Define the New quote
        let newQuote = {
            id,
            quote,
            author,
            like
        };
        // console.log(newQuote);

        // GET INDEX OF THE QUOTE TO UPDATE
        let index = db.getIndex("/quotes", id);
        // console.log(index)

        // GET ITEM IN THE ARRAY
        let data = db.getData(`/quotes[${index}]`);
        // console.log(data);

        if (data.id !== id) {
            // RETURN
            return res.status(200)
                .redirect('/');
        }
        // ARRAY UPDATE
        // BY DEFAULT THE PUSH WILL OVERRIDE THE OLD VALUES
        db.push(`/quotes[${index}]`, newQuote);

        // RETURN REDIRECT
        return res.status(200)
            .redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something really bad happened! 😱 ${error}` })
    };

});

// DELETE
router.delete('/delete/:id', (req, res) => {
    try {
        let id = +req.params.id;
        // DELETE ALL DATA
        // db.delete("/quotes");
        // Doing this will delete the object stored at the index 0 of the array.
        // Keep in mind this won't delete the array even if it's empty.
        //db.delete("/arraytest/myarray[0]");

        // DELETE SPECIFIC OBJECT IN THE ARRAY
        // FIRST FIND THE INDEX WITH THE ID
        let indexToDelete = db.getIndex('/quotes', id);
        // console.log(indexToDelete);
        // DELETE
        db.delete(`/quotes[${indexToDelete}]`);

        // RETURN
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Something really bad happened! 😱 ${error}` })
    };
});

// Export 
module.exports = router;