import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import session from "express-session";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: '12df243e', 
    resave: false,
    saveUninitialized: true
}));

function passwordCheck(req, res, next) {
    if (req.body["username"] === "testUser01" && req.body["password"] === "testPassword.01") {
        req.session.authorized = true;
        req.session.username = req.body["username"];
    }
    next();
}

// route to render the initial login form
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/login");
        res.render("login.ejs", { error: null });
    } catch (error) {
        res.status(500).json({ message: "Error loading login form" });
    }
});

// Check if the password given is valid, if so render the home page
app.post("/home", passwordCheck, async (req, res) => {
    if (req.session.authorized) {
        try {
            const response = await axios.get(API_URL + "/home");
            res.render("index.ejs", { username: req.session.username, posts: response.data });
        } catch (error) {
            res.status(500).json({ message: "Error loading home page" });
        }
    } else {
        res.render('login.ejs', { error: 'Invalid username or password' });
    }
});

// render the home page when the home page button on the left sidebar is clicked
app.get("/home", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/home");
        console.log((response.data)[0].title);
        res.render("index.ejs", { username: req.session.username, posts: response.data });
    } catch (error) {
        res.status(500).json({ message: "Error loading home page" });
    }
});

// allow to user to render the post creation form
app.get("/create-post", (req, res) => {
    res.render("post.ejs"); 
});

// allow user to post the latter created
app.post("/post", async (req, res) => {
    try {
        await axios.post(API_URL + "/post", req.body);
        res.redirect("/home");
    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
});

// route to access the user's profile
app.get("/profile", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/profile");
        res.render("profile.ejs", { username: req.session.username, posts: response.data })
    } catch (error) {
        res.status(500).json({ message: "Error loading user's profile" });
    }
});

app.get("/search", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/search");
        const posts = response.data;
        let randomIndex = null;

        if (posts.length > 0) { 
            randomIndex = Math.floor(Math.random() * posts.length); 
        }

        res.render("search.ejs", {
            username: req.session.username,
            randomIndex: randomIndex, 
            post: null,
            posts,
        });
    } catch (error) {
        res.status(500).json({ message: "Error loading search page" });
    }
});

app.post("/search", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/search");
        const posts = response.data;
        const randomIndex = Math.floor(Math.random() * posts.length); 
        const foundPost = posts.find(post => post.title.toLowerCase() === req.body.title.toLowerCase());
        res.render("search.ejs", {
            username: req.session.username,
            post: foundPost || null,
            randomIndex: randomIndex,
            posts
        });
    } catch (error) {
        res.status(500).json({ message: "Error searching for post" });
    }
});


// app.post('/profile/delete/:id', async (req, res) => {
//     try {
//       await axios.delete(`${API_URL}/profile/${req.params.id}`);
//       res.redirect('/profile'); // Redirect to profile after deletion
//     } catch (error) {
//       res.status(500).json({ message: 'Error deleting post' });
//     }
// });

app.post('/profile/:id', async (req, res) => {
    console.log('Request received for deleting post:', req.params.id);
    console.log('Request body:', req.body);
    if (req.body._method === 'DELETE') {
        try {
            await axios.delete(`${API_URL}/profile/${req.params.id}`);
            res.redirect('/profile');
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Error deleting post' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
});
  

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
  