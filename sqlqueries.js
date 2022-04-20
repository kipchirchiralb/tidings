const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testtidings",
});
connection.query(
    "CREATE TABLE if not exists users(id INT NOT NULL AUTO_INCREMENT, email VARCHAR(25), fullname VARCHAR(25),gender VARCHAR(10), profileImg BLOB, password VARCHAR(100), PRIMARY KEY(id))",
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
  connection.query(
    "CREATE TABLE if not exists tyds(id INT NOT NULL AUTO_INCREMENT, tyd VARCHAR(255),likes INT DEFAULT 0,comments INT DEFAULT 0, userId INT(20), dateposted DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id))",
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
  connection.query(
    "CREATE TABLE if not exists likes(id INT NOT NULL AUTO_INCREMENT, tydId INT(20),userId INT(20), PRIMARY KEY(id), FOREIGN KEY (tydId) REFERENCES tyds(id), FOREIGN KEY (userId) REFERENCES users(id))",
    (err, result)=>{
      if(err){
        console.log(error)
      }
    }
  )
  connection.query(
    "CREATE TABLE if not exists comments(id INT NOT NULL AUTO_INCREMENT,comment VARCHAR(255),dateposted DATETIME DEFAULT CURRENT_TIMESTAMP,likes INT DEFAULT 0, tydId INT(20),userId INT(20), PRIMARY KEY(id), FOREIGN KEY (tydId) REFERENCES tyds(id), FOREIGN KEY (userId) REFERENCES users(id))",
    (err, result)=>{
      if(err){
        console.log(err)
      }
    }
  )
  connection.query(
    "CREATE TABLE if not exists comments(id INT NOT NULL AUTO_INCREMENT,comment VARCHAR(255),dateposted DATETIME DEFAULT CURRENT_TIMESTAMP,likes INT DEFAULT 0, tydId INT(20),userId INT(20), PRIMARY KEY(id), FOREIGN KEY (tydId) REFERENCES tyds(id), FOREIGN KEY (userId) REFERENCES users(id))",
    (err, result)=>{
      if(err){
        console.log(err)
      }
    }
  )
  connection.query(
    "CREATE TABLE if not exists notifications(id INT NOT NULL AUTO_INCREMENT,type VARCHAR(25),dateposted DATETIME DEFAULT CURRENT_TIMESTAMP, tydId INT(20), forId INT(20),fromId INT(20), PRIMARY KEY(id), FOREIGN KEY (forId) REFERENCES users(id),FOREIGN KEY (fromId) REFERENCES users(id), FOREIGN KEY (tydId) REFERENCES tyds(id))",
    (err, result)=>{
      if(err){
        console.log(err)
      }
    }
  )
  