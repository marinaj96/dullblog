const pg = require("pg");
const dbURI = "postgres://kctqqhohmrrxyn:7d219df3fe9dffd85aee3583979e44889a3571b8dc7d1adc2f47a543cf9e9026@ec2-34-253-116-145.eu-west-1.compute.amazonaws.com:5432/d4pem088dvlid9";
const connstring = process.env.DATABASE_URL || dbURI;
const pool = new pg.Pool({
	connectionString: connstring,
	ssl: {rejectUnauthorized: false}
});

let dbMethods = {};


dbMethods.getAllBlogPosts = function(){
    let sql = "SELECT * FROM blogposts";
    return pool.query(sql);
}

dbMethods.createBlogPost = function(heading, blogtext, userid){
    let sql = "INSERT INTO blogposts (id, date, heading, blogtext, userid) VALUES(DEFAULT, DEFAULT, $1, $2, $3) returning *";
	let values = [heading, blogtext, userid];
    return pool.query(sql, values);
}

dbMethods.deleteBlogPost = function(id){
    let sql = "DELETE FROM blogposts WHERE id = $1 RETURNING *";
	let values = [id];
    return pool.query(sql, values);
}


module.exports = dbMethods;
