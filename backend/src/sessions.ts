import * as session from "express-session";

export default session({
    secret: process.env.SECRET_COOKIE || "BrQQjJr4KtqDowz57De1",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
})