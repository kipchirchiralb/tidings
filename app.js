const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const PORT = process.env.PORT || 3000;

// trial multer middlware- for uploading files to server
//  trial uuid - providing unique identifer to image filenames
// sharp toresize the images
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFile(filepath);

    return filename;
  }
  static filename() {
    return `${uuidv4()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`);
  }
}

// continue

const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tidings",
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
  "CREATE TABLE if not exists tyds(id INT NOT NULL AUTO_INCREMENT, tyd VARCHAR(255),likes INT DEFAULT 0, userId INT(20), dateposted DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id))",
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

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.isLoggedIn = false;
  } else {
    res.locals.isLoggedIn = true;
    res.locals.userId = req.session.userId;
    res.locals.profileImg = req.session.profileImage;
    res.locals.username = req.session.username.split(" ")[0];
  }
  next();
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/about", (req, res) => {
  res.render("about-us.ejs");
});
app.get("/login", (req, res) => {
  if (res.locals.isLoggedIn) {
    res.redirect("/");
  } else {
    res.render("login.ejs", { error: false });
  }
});
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  connection.query(
    "SELECT * FROM  users WHERE  email = ?",
    [email],
    (error, results) => {
      if (results.length > 0) {
        bcrypt.compare(password, results[0].password, (err, isEqual) => {
          if (isEqual) {
            req.session.userId = results[0].id;
            req.session.username = results[0].fullname;
            req.session.profileImg = results[0].profileImg;
            res.redirect("/tyds");
          } else {
            let errorMessage = "Email password mismatch";
            res.render("login.ejs", {
              error: true,
              email: email,
              password: password,
              errorMessage: errorMessage,
            });
          }
        });
      } else {
        let errorMessage = "Email not registered";
        res.render("login.ejs", {
          error: true,
          email: email,
          password: password,
          errorMessage: errorMessage,
        });
      }
    }
  );
});
app.get("/signup", (req, res) => {
  if (res.locals.isLoggedIn) {
    res.redirect("/");
  } else {
    res.render("signup.ejs", { error: false });
  }
});
app.post("/signup", upload.single("profileImage"), (req, res) => {
  let email = req.body.email,
    fullname = req.body.fullname,
    gender = req.body.gender,
    password = req.body.password,
    confirmPassword = req.body.confirmPassword,
    profileImage;
  // ***********
  const imagePath = path.join(__dirname, "/public/images");
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    profileImage = "/images/default-profile.png";
  }
  savedProfileImage = fileUpload.save(req.file.buffer);
  profileImage = `/images/${savedProfileImage}`;
  // ********
  if (password === confirmPassword) {
    bcrypt.hash(password, 10, (error, hash) => {
      connection.query(
        "SELECT email FROM users WHERE email = ?",
        [email],
        (error, results) => {
          if (results.length === 0) {
            connection.query(
              "INSERT INTO users (email, fullname,profileImg,gender, password) VALUES (?, ?, ?,?, ?)",
              [email, fullname, profileImage, gender, hash],
              (error, results) => {
                if (error) {
                  console.log(error);
                  let errorMessage =
                    "Problems encountered when saving your data, Please contact admin";
                  res.render("signup.ejs", {
                    error: true,
                    errorMessage: errorMessage,
                    email: email,
                    fullname: fullname,
                    password: password,
                    confirmPassword: confirmPassword,
                    gender: gender,
                    profileImage: profileImage,
                  });
                } else {
                  res.redirect("/login");
                }
              }
            );
          } else {
            let message = "Email already exists.";
            res.render("signup.ejs", {
              error: true,
              errorMessage: message,
              email: email,
              fullname: fullname,
              password: password,
              confirmPassword: confirmPassword,
              gender: gender,
              profileImage: profileImage,
            });
          }
        }
      );
    });
  } else {
    let errorMessage = "Password & Confirm Password  do not match.";
    res.render("signup.ejs", {
      error: true,
      errorMessage: errorMessage,
      email: email,
      fullname: fullname,
      password: password,
      confirmPassword: confirmPassword,
      gender: gender,
      profileImage: profileImage,
    });
  }
});

// tyds
app.get("/tyds", (req, res) => {
  if (res.locals.isLoggedIn) {
    connection.query(
      "SELECT * FROM tyds ORDER BY datePosted DESC",
      (error, tyds) => {
        if (error) {
          console.log(error);
        } else {
          connection.query("SELECT * FROM users", (error, users) => {
            if (error) {
              console.log(error);
            } else {
              connection.query(
                "SELECT * FROM users WHERE id=? ",
                [res.locals.userId],
                (error, user) => {
                  if (error) {
                    console.log(error);
                  } else {
                    connection.query("SELECT * FROM likes WHERE userId= ?",[req.session.userId],
                    (error, likes)=>{
                      if(error){
                        console.log(error)
                      }else{
                        res.render("tyds.ejs", {
                          tyds: tyds,
                          users: users,
                          user: user[0],
                          likes: likes,
                        });
                      }
                     
                    })
                    
                  }
                }
              );
            }
          });
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});
// new-tyd

app.post("/new-tyd", (req, res) => {
  if (res.locals.isLoggedIn) {
    connection.query(
      "INSERT INTO tyds (tyd, userId) VALUES (?, ?)",
      [req.body.tyd, req.session.userId],
      (error, results) => {
        if (error) {
          console.error(error);
        } else {
          res.redirect("/tyds");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/");
  });
});
app.post('/updatelikes',(req,res)=>{
  if(res.locals.isLoggedIn){
    let value = parseInt(req.query.value)
    let tydId= parseInt(req.query.id)
    
    connection.query(`SELECT * FROM likes WHERE tydId= ${tydId} AND userId=${req.session.userId}`,
    (error, likes)=>{
      if(error){
        console.log(error)
      }else{
        if(likes.length>0){
          value = value-1
          connection.query(`UPDATE tyds SET likes = ${value} WHERE id = ${tydId}`,
            (error, result)=>{
              if(error){
                console.log(error)
              }else{ 
                connection.query(`DELETE FROM likes  WHERE tydId=${tydId} AND userId=${req.session.userId}`,(error, result)=>{
                  if(error){
                    console.log(error)
                  }else{
                    res.redirect('/tyds')
                  }
                })   
                   
              }
            })
        }else{
          value = value+1
          connection.query(`UPDATE tyds SET likes = ${value} WHERE id = ${tydId}`,
            (error, result)=>{
              if(error){
                console.log(error)
              }else{
                connection.query("INSERT INTO likes (tydId, userId) VALUES (?,?)",[tydId, req.session.userId],
                (error, result)=>{
                  if(error){
                    console.log(error)
                  }else{
                    res.redirect('/tyds')
                  }
                })
        
              }
            })
        }
      }
    })
    
  }else{
    res.redirect('/login')
  }
  
})


app.all("*", (req, res) => {
  res.render("404.ejs", { error: true });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
