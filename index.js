import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

let posts = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/login", (req, res) => {
    res.json();
});

// GET all of the posts
app.get("/home", (req, res) => {
    res.json(posts);
});

// GET the post form
app.get("/post", (req, res) => {
    res.json();
});

// POST a new post
app.post("/post", (req, res) => {
    const post = {
        title: req.body.title,
        content: req.body.content,
        date: new Date(),
        visibility: req.body.visibility
    };

    posts.push(post);
    res.status(201).json(post);
});

// GET the profile info
app.get("/profile", (req, res) => {
    res.json(posts);
}); 

// GET the posts for the search page
app.get("/search", (req, res) => {
    res.json(posts);
});

// // Route to delete a post
// app.delete('/profile/:id', (req, res) => {
//     const index = posts.findIndex(p => p._id === req.params.id);
//     if (index !== -1) {
//         posts.splice(index, 1);
//         res.json({ message: 'Post deleted' });
//     } else {
//         res.status(404).json({ message: 'Post not found' });
//     }
// });

app.delete('/profile/:id', (req, res) => {
    console.log('Delete request for ID:', req.params.id);
    const index = posts.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
        posts.splice(index, 1);
        res.json({ message: 'Post deleted' });
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
  

// el problñem es que el ejemplo tiene un get request para cada post/:id y yo no, estoy intentando hacerlo sdirecto desde profile 