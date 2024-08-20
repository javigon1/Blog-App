import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';

// Determine the directory name for file path resolution
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let posts = [];

// Configure session
app.use(session({
    secret: '12df243e', 
    resave: false,
    saveUninitialized: true
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for checking username and password
function passwordCheck(req, res, next) {
    if (req.body["username"] === "testUser01" && req.body["password"] === "testPassword.01") {
        req.session.authorized = true;
        req.session.username = req.body["username"];
    }
    next();
}

// Route for rendering login page
app.get('/', (req, res) => {
    res.render('login', { error: null });
});

// Route for handling form submission
app.post('/home', passwordCheck, (req, res) => {
    if (req.session.authorized) {
        res.redirect('/index');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

app.get("/index", (req, res) => {
    if (req.session.authorized) {
        res.render('index', { username: req.session.username, posts });
    } else {
        res.redirect('/');
    }
});

app.get("/create-post", (req, res) => {
    if (req.session.authorized) {
        res.render("post");
    } else {
        res.redirect('/'); 
    }
});

app.get("/profile", (req, res) => {
    res.render("profile", { username: req.session.username, posts });
});

app.get("/home", (req, res) => {
    res.render("index", { username: req.session.username, posts });
});

app.post("/view-posts", (req, res) => {
    const title = req.body.firstName;
    const description = req.body.lastName;
    const visibility = req.body.paymentMethod;

    posts.push({ _id: uuidv4(), title, description, visibility });

    res.redirect("/index");
});

app.get("/search", (req, res) => {
    if (posts.length > 0) {
        const randomIndex = Math.floor(Math.random() * posts.length);
        res.render("search", { 
            username: req.session.username, 
            posts,
            randomIndex,
            post: null
        });
    } else {
        res.render("search", { 
            username: req.session.username, 
            posts: [],
            randomIndex: null,
            post: null
        });
    }
});

app.post("/search", (req, res) => {
    const searchTitle = req.body.searchPost; 
    const foundPost = posts.find(post => post.title.toLowerCase() === searchTitle.toLowerCase());
    const randomIndex = Math.floor(Math.random() * posts.length);

    res.render("search", {
        username: req.session.username,
        post: foundPost || null,
        randomIndex,
        posts
    });
});

// delete a given post
app.post('/posts/:id', (req, res) => {
    const index = posts.findIndex(post => post._id === req.params.id); 
    if (index === -1) return res.status(404).json({ message: "Post not found" });
    
    posts.splice(index, 1);
    res.redirect("/profile");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});