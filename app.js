// JavaScript source code
let users = [
    {
        "username": "doctorwhocomposer",
        "password": "password",
        "forename": "Delia",
        "surname": "Derbyshire",
        "email": "Derby@mail.com",
        "status": "Status: Feeling who?",
        "access_token": "concertina"
    },

    {
        "username": "Joeboy",
        "password": "pass",
        "forename": "Noname",
        "surname": "Johnson",
        "email": "johnny@mail.com",
        "status": "Status: I am the one with no name.",
        "access_token": ""
    }

]

let comments = [];

ex_user = { //Example object
    "username": "doctorwhocomposer",
    "password": "password",
    "forename": "Delia",
    "surname": "Derbyshire",
    "email": "Derby@mail.com",
    "status": "Status: Feeling who?",
    "access_token": "concertina"
};

ex_comment = { //Example comment
    "username": "commenter",
    "content": "SampleText"
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('client-sessions');

function findUser(username) {
    for (let i in users) {
        if (users[i].username === username) return users[i];
    }
}

function filterComments(username) {
    filtered = [];
    for (let i in comments) {
        if (comments[i].username === username) {
            filtered.push(comments[i]);
        }
    }
    return filtered;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: './views' });
});

app.use(session( {
    cookieName: 'userSession',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 60 * 60 * 1000,
    secret: 'sekrit',
    cookie: {
        ephemeral: true,
        httpOnly: true,
        secure: false
    }
}));

app.post('/login', function (req, res) {
    let message;
    let status;
    for (let i in users) {
        if (users[i].username != req.body.username) {
            message = "Username does not exist.";
            status = 403;
        }
        else {
            if (users[i].password != req.body.password) {
                message = "Incorrect password.";
                status = 403;
                break;
            }
            else {
                req.userSession.loggedIn = true;
                req.userSession.username = req.body.username;
                req.userSession.access_token = findUser(req.body.username).access_token;
                message = "Login Successful";
                status = 200;
                break;
            }
        }
    }
    res.status(status);
    res.send(message);
});

app.get('/logout', function (req, res) {
    req.userSession.reset();
    res.redirect('/');
});

app.post('/register', function (req, res, next) {
    const person = req.body.username;
    for (let i in users) {
        if (users[i].username === person) {
            console.log("Registration request for " + person + " failed. Cause: Username taken.");
            res.status(400);
            res.send("Username taken, please try again.");
            return 0;
        }
    }
    if (req.body.password != req.body.retypePass) {
        console.log("Registration request for " + person + " failed. Cause: Passwords do not match.");
        res.status(400);
        res.send("Passwords do not match, please try again.");
        return 0;
    }
    users.push({
        "username": person,
        "password": req.body.password,
        "forename": req.body.forename,
        "surname": req.body.surname,
        "email": req.body.email,
        "status": "Status: Feeling blue.",
        "access_token": ""
    });

    req.userSession.loggedIn = true;
    req.userSession.username = person;
    req.userSession.access_token = "";
    console.log("Registration request for user " + person + " successful.");
    res.status(200);
    res.send("Registration successful");
});

app.post('/people', function (req, res, next) {
    const person = req.body.username;
    if (req.body.access_token != "concertina") {
        res.status(403);
        res.send("403 Unautharized access_token.");
        return 0;
    }
    for (let i in users) {
        if (users[i].username === person) {
            console.log("Registration request for " + person + " failed. Cause: Username taken.");
            res.status(400);
            res.send("Username taken, please try again.");
            return 0;
        }
    }
    if (req.body.password != req.body.retypePass) {
        console.log("Registration request for " + person + " failed. Cause: Passwords do not match.");
        res.status(400);
        res.send("Passwords do not match, please try again.");
        return 0;
    }
    users.push({
        "username": person,
        "password": req.body.password,
        "forename": req.body.forename,
        "surname": req.body.surname,
        "email": req.body.email,
        "status": "Status: Feeling blue.",
        "access_token": ""
    });

    req.userSession.loggedIn = true;
    req.userSession.username = person;
    req.userSession.access_token = "";
    console.log("Registration request for user " + person + " successful.");
    res.status(200);
    res.send("Registration successful");
});

app.get('/people', function (req, res) {
    res.status(200);
    res.json({ users: users });
});

app.get('/people/doctorwhocomposer', function (req, res) {
    res.status(200);
    const delia = findUser("doctorwhocomposer");
    res.json(delia);
});

app.use(function (req, res, next) {
    if (req.userSession.loggedIn) {
        next();
    }
    else {
        res.status(403).json({
            message: "403 Request Denied.",
        })
    }
});

app.get('/main', function (req, res) {
    const user = findUser(req.userSession.username);
    status = user.status;
    if (status) {
        res.status(200);
        res.json({
            "username": user,
            "status": status,
            "comments": comments
        });
    }
    else {
        res.status(400);
        res.send("A problem has occured.");
    }
});

app.post('/main/comment', function (req, res) {
    content = req.body.comment;
    const user = req.userSession.username;
    comment = { "username": user, "content": content }
    comments.push(comment);
    res.json(comments);
});

app.get('/main/comment', function (req, res) {
    res.json(comments);
});

app.post('/main/status', function (req, res) {
    const status = req.body.status;
    const user = findUser(req.userSession.username);
    user.status = statusl
    res.status(200);
    res.json(status);
});

app.get('/profile', function (req, res) {
    const user = findUser(req.userSession.username);
    res.status(200);
    res.json({
        "username": user.username,
        "email": user.email,
        "forename": user.forename,
        "surname": user.surname,
    });
});

app.post('/profile/password', function (req, res) {
    const user = findUser(req.userSession.username);
    if (req.body.oldPassword != user.password) {
        res.status(401)
        res.send("Your old password is incorrect.");
        return 0;
    }
    else {
        if (req.body.newPassword != req.body.newPassreType) {
            res.status(401)
            res.send("Your new password does not match.");
            return 0;
        }
    }
    user.password = req.body.newPassword;
    res.status(200)
    console.log("sent");
    res.send("Password successfully changed.");
});

app.post('/profile/details', function (req, res) {
    const user = findUser(req.userSession.username);
    if (req.body.password != user.password) {
        res.status(401)
        res.send("Your password is incorrect.");
        return 0;
    }
    else {
        if (req.body.email != "") { //Block makes sure that fields left empty do not overwrite existing data
            user.email = req.body.email;
        }
        if (req.body.forename != "") {
            user.forename = req.body.forename;
        }
        if (req.body.surname != "") {
            user.surname = req.body.surname;
        }
    }
    res.status(200);
    res.json({
        "username": req.userSession.username,
        "email": user.email,
        "forename": user.forename,
        "surname": user.surname
    });
});

app.get('/people/user', function (req, res) {
    if (req.query.username === "/admin") {
        if (req.userSession.access_token === "concertina") {
            res.status(200);
            res.json({
                "users": users,
                "admin": true
            });
            return 0;
        }
        else {
            res.status(403);
            res.send("Command only available to admin.");
            return 0;
        }
    }
    let user = findUser(req.query.username);
    if (user) {
        res.status(200);
        res.json({
            "username": user.username,
            "email": user.email,
            "forename": user.forename,
            "surname": user.surname,
            "userStatus": user.status,
            "comments": filterComments(user.username),
            "admin": false
        });
    }
    else {
        res.status(404);
        res.send("User does not exist.");
    }
});

app.post('/people/delete', function (req, res) {
    let user = findUser(req.body.username);
    if (user) {
        if (user.access_token === "concertina") {
            res.status(400);
            res.send("You are trying to delete an admin.");
            return 0;
        }
        for (let i in users) {
            if (user.username === users[i].username) {
                users.splice(i, 1);
                break;
            }
        }
        let newComments = comments.filter(function (value, index, arr) {
            return user.username !== value.username;
        });
        comments = newComments;
        res.status(200);
        res.json({
            "users": users,
            "admin": true
        });
        return 0;
    }
    else {
        res.status(404);
        res.send("This user does not exist.");
        return 0;
    }
})

module.exports = app;