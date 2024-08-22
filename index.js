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


// // GET a specific post by title
// app.get("/search/:title", (req, res) => {
//     const foundPost = posts.find((post) => post.title === req.params.title);
//     if (!foundPost) return res.status(404).json({ message: "Post not found" });
//     res.json(foundPost);
// });


// // PATCH a post when you just want to update one parameter
// app.patch("/posts/:id", (req, res) => {
//     const post = posts.find((p) => p.id === parseInt(req.params.id));
//     if (!post) return res.status(404).json({ message: "Post not found" });
  
//     if (req.body.title) post.title = req.body.title;
//     if (req.body.content) post.content = req.body.content;
  
//     res.json(post);
// });

// // DELETE a specific post by providing the post id
// app.delete("/posts/:id", (req, res) => {
//     const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
//     if (index === -1) return res.status(404).json({ message: "Post not found" });
  
//     posts.splice(index, 1);
//     res.json({ message: "Post deleted" });
// });
  

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
  