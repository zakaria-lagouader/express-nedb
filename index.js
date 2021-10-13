const express = require("express");
const Datastore = require('nedb');
const bodyParser = require("body-parser");

const db = new Datastore({ filename: 'posts.db', autoload: true });

const app = express();

// read jason from request body
app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    // load posts
    db.find({}, (error, docs) => {
        if (error) {
            res.status(501).json({error});
            return;
        }
        if (!docs) {
            res.status(404).json({ message: "error" })
            return;
        }
        res.json(docs);
    })
});

app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.findOne({_id: id}, (error, doc) => {
        if (error) {
            res.status(501).json({error});
            return;
        }
        if (!doc) {
            res.status(404).json({ message: "error" })
            return;
        }
        res.json(doc);
    })
})

app.post("/posts", (req, res) => {
    const { title, body } = req.body;
    const post = { title, body };

    // save post
    db.insert(post, (error, doc) => {
        if (error) {
            res.status(501).json({error});
            return;
        }
        if (!doc) {
            res.status(404).json({ message: "error" })
            return;
        }
        res.json(doc);
    })
})

app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;
    const post = { title, body };

    // save post
    db.update({_id: id}, {$set: post}, {}, (error, numReplaced, doc) => {
        if (error) {
            res.status(501).json({error});
            return;
        }
        res.json({ message: "success" });
    })
})

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;

    // save post
    db.remove({_id: id}, (error, numDeleted) => {
        if (error) {
            res.status(501).json({error});
            return;
        }
        res.json({ message: "success" });
    })
})

app.listen(5000, () => {
    console.log("Listening on port 5000 !")
})