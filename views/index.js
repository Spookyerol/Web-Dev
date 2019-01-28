// JavaScript source code for front-end client

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function makeBurger() {
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

function navigateTo(pageName) {
    $.ajax({
        url: "/" + pageName,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            let context = res;
            $("a").removeClass("active");
            if (pageName === 'profile') {
                let source = $("#userData").html().trim();
                let template = Handlebars.compile(source);
                $("#profile").addClass("active");
                $("#registerPage").css("display", "none");
                $("#mainPage").css("display", "none");
                $("#userPage").css("display", "none");
                $("#adminPage").css("display", "none");
                $("#profilePage").css("display", "block");
                let html = template(context);
                $("#userDetails").html(html);
            }
            else {
                if (pageName === "main") {
                    let source = $("#userStatus").html().trim();
                    let template = Handlebars.compile(source);
                    $("#main").addClass("active");
                    $("#registerPage").css("display", "none");
                    $("#profilePage").css("display", "none");
                    $("#userPage").css("display", "none");
                    $("#adminPage").css("display", "none");
                    $("#mainPage").css("display", "block");
                    let html = template(context);
                    $("#status").html(html);
                    renderComments(res.comments, "#comments");
                }
                else {
                    if (pageName === "people/user") {
                        let source = $("#otherUserStatus").html().trim();
                        let template = Handlebars.compile(source);
                        $("#registerPage").css("display", "none");
                        $("#profilePage").css("display", "none");
                        $("#mainPage").css("display", "none");
                        $("#adminPage").css("display", "none");
                        $("#userPage").css("display", "block");
                        let html = template(context);
                        $("#otherStatus").html(html);
                        renderComments(res.comments, "#userComments");
                        source = $("#userData").html().trim();
                        template = Handlebars.compile(source);
                        html = template(res);
                        $("#otherUserDetails").html(html);
                    }
                    else {
                        if (pageName === "admin") {

                        }
                    }
                }
            }
            console.log("Navigated to " + pageName);
        },

        error: function (res) {
            alert("403 request denied.");
            console.log("Failed to navigate to " + pageName);
        },
    });
}

function loginHandler() {
    username = $("#username").val();
    userdata = { "username": username, "password": $("#password").val() };
    $.ajax({
        url: "/login",
        type: "POST",
        data: JSON.stringify(userdata),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            navigateTo('main');
            console.log('Login success');
        },

        error: function (res) {
            alert(res.responseText);
            console.log('Login error');
        }
    });
}

function logoutHandler() {
    $.ajax({
        url: "/logout",
        type: "GET",
        success: function (res) {
            console.log("Logged out.");
        },

        error: function (res) {
            console.log("Failed to log out.");
        }
    });
}

function registerHandler() {
    accountData = {
        "username": $("#new_user").val(),
        "password": $("#new_pass").val(),
        "retypePass": $("#new_passRetype").val(),
        "email": $("#new_mail").val(),
        "forename": $("#forename").val(),
        "surname": $("#surname").val()
    };
    $.ajax({
        url: "/register",
        type: "POST",
        data: JSON.stringify(accountData),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            navigateTo('main');
            console.log('Registration success');
        },

        error: function (res) {
            console.log('Registration error');
            alert('Registration Failed');
        },
    });
}

function newComment() {
    content = { "comment": $("#comment").val() };
    $.ajax({
        url: "/main/comment",
        type: "POST",
        data: JSON.stringify(content),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            renderComments(res, "#comments");
            console.log("Comment added.");
        },

        error: function () {

        }
    });
}

function createComment(context) {
    let source = $("#commentTemplate").html().trim();
    let template = Handlebars.compile(source);
    let html = template(context);
    $("#comments").prepend(html);
    return 0;
}

function renderComments(comments, target) {
    $(target).empty();
    for (let i in comments) {
        let context = {
            "username": comments[i].username,
            "content": comments[i].content
        };
        let source = $("#commentTemplate").html().trim();
        let template = Handlebars.compile(source);
        let html = template(context);
        $(target).prepend(html);
    }
    return 0;
}

function getComments() {
    $.ajax({
        url: "/main/comment",
        type: "GET",
        success: function (res) {
            renderComments(res, "#comments");
        },

        error: function () {
            console.log("Response not received.");
        }
    });
}

function changeStatus() {
    $.ajax({
        url: "/main/status",
        type: "POST",
        data: JSON.stringify({ "status": $("#status").text() }),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            alert("Status updated.");
            console.log("Status updated to: " + JSON.stringify(res.responseText));
        },

        error: function (res) {
            alert("Status not updated. Please try again.");
            console.log("Status not updated.");
        }
    });
}

function changePassword() {
    data = {
        "oldPassword": $("#oldPassword").val(),
        "newPassword": $("#newPassword").val(),
        "newPassreType": $("#newPassreType").val(),
    }
    $.ajax({
        url: "/profile/password",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            alert("Password changed successfully.");
            console.log("Password changed successfully.");
        },

        error: function (res) {
            alert(res.responseText);
            console.log(res.responseText);
        }
    });
}

function changeDetails() {
    data = {
        "password": $("#pass").val(),
        "email": $("#email").val(),
        "forename": $("#firstName").val(),
        "surname": $("#LastName").val()
    }
    $.ajax({
        url: "/profile/details",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            navigateTo('profile');
            alert("Details successfully changed.");
            console.log("Details changed successfully.");
        },

        error: function (res) {
            alert(res.responseText);
            console.log(res.responseText);
        }
    });
}

function searchUser() {
    query = { "username": $("#userquery").val() };
    $.ajax({
        url: "/people/user",
        type: "GET",
        data: query,
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res.admin) {
                let source = $("#adminData").html().trim();
                let template = Handlebars.compile(source);
                $("#registerPage").css("display", "none");
                $("#profilePage").css("display", "none");
                $("#mainPage").css("display", "none");
                $("#userPage").css("display", "none");
                $("#adminPage").css("display", "block");
                $("#showDetails").empty();
                for (let i in res.users) {
                    let html = template(res.users[i]);
                    $("#showDetails").append(html);
                }
                console.log("Navigated to admin.");
            }
            else {
                let source = $("#otherUserStatus").html().trim();
                let template = Handlebars.compile(source);
                $("#registerPage").css("display", "none");
                $("#profilePage").css("display", "none");
                $("#mainPage").css("display", "none");
                $("#adminPage").css("display", "none");
                $("#userPage").css("display", "block");
                let html = template(res);
                $("#otherStatus").html(html);
                renderComments(res.comments, "#userComments");
                source = $("#userData").html().trim();
                template = Handlebars.compile(source);
                html = template(res);
                $("#otherUserDetails").html(html);
                console.log("User found.");
            }
        },

        error: function (res) {
            alert(res.responseText);
            console.log(res.responseText);
        }
    });
}

function deleteUser() {
    $.ajax({
        url: "/people/delete",
        type: "POST",
        data: JSON.stringify({ "username": $("#banUsername").val() }),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            $("#showDetails").empty();
            let source = $("#adminData").html().trim();
            let template = Handlebars.compile(source);
            for (let i in res.users) {
                let html = template(res.users[i]);
                $("#showDetails").append(html);
            }
            alert("User successfully deleted.");
        },

        error: function (res) {
            alert(res.responseText);
        }
    });
}