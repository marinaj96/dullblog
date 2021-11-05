const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());

const blogpost = require('./modules/blogposts.js');
const authUtils = require('./modules/auth_utils.js')
const users = require('./modules/users.js')

server.use(blogpost);
server.use(users);

// endpoints ----------------------------




server.use(function (err, req, res, next){
	res.status(500).json({
		error: 'Something went wrong on the server',
		descr: err
	}).end();
})

// start server ------------------------
server.listen(server.get("port"), function () {
	//console.log("server running", server.get("port"));
});