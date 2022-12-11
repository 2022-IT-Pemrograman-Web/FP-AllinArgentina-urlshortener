import { getAuth,  signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import express from 'express';
import cors from 'cors';
import { db } from '../server/config/db.js';
import { auth } from '../server/config/config.js';
import { admin } from '../server/config/db.js';

const app = express();
const port = 8080;
const sLinks = db.collection('shortUrls')
// const admin = require("firebase-admin");

app.use(cors())
app.use(express.json());

const statics = express.static("public");
app.use(statics);

//Extract the POST request body data
app.use(
  express.urlencoded({
    extended: true,
  })
);

const isAbsoluteUrl = (url) => /^[a-z][a-z0-9+.-]*:/.test(url);

// Function to POST shortened links
app.post("/api/post", async (req, res) => {

  // const { href } = req.body.fullUrl;

  // const { shortUrl } = req.body.shortUrl;
  // const possible =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // for (let i = 0; i < 5; i++) {
  //   shortUrl += possible.charAt(Math.floor(Math.random() * possible.length));
  // }

  if (isAbsoluteUrl(req.body.fullUrl)) {
    try {
      let shortUrl = req.body.shortUrl;
      const shortUrlRef = sLinks.doc(req.body.shortUrl);
      const doc = await shortUrlRef.get();
      if (doc.exists) {
        res.send({
          message: "Short url already exists",
          status: false,
        });
      } else {
        // sLinks.add({
        //   fullUrl: req.body.fullUrl,
        //   shortUrl: req.body.shortUrl,
        //   viewCount: 0,
        // })
        sLinks.doc(req.body.shortUrl).set({
          urlTitle : req.body.urlTitle, 
          fullUrl: req.body.fullUrl,
          shortUrl: req.body.shortUrl,
          viewCount: req.body.viewCount,
        });
        // res.send({ shortUrl });
        res.send({ shortUrl });
        
        res.send({
          message: "Short url created successfully",
          status: true,
        });
      }
    } catch (err) { 
      console.log(err);
    }
  } else {
    console.log("Please enter valid url!");
  }
});

// Function to redirect links
app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrlRef = sLinks.doc(req.params.shortUrl);
    const doc = await shortUrlRef.get();
    if (doc.exists) {
      const shortUrl = doc.data();
      shortUrlRef.update({
        viewCount: shortUrl.viewCount + 1,
      });
      res.redirect(shortUrl.fullUrl);
    } else {
      res.send({
        message: "Short url does not exist",
        status: false,
      });
    } 
  } catch (err) {
    console.log(err);
  }
  });

// Function to GET list of shortened links
app.get("/api/get", async (req, res) => { 
  try {
    let shortUrls = [];
    sLinks.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let id = doc.id;
        shortUrls.push({ id, ...doc.data() });
      });
      res.send(shortUrls);
    });
  } catch (err) {
    console.log(err);
  }
});

 app.post("/user/register", async (req, res)=>{
  // const users = db.collection("userInfo")
  let email = req.body.email
  let password = req.body.password
  try {
    const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            const user = userCredential.user
            const uid = user.uid
            res.send(uid)
        })
        // users.add({
        //     email: req.body.email,
        //     password: req.body.password
        // })
        // res.send({
        //     status: true,
        //     message: "Succesfully created user"
        // })
    }
    catch (e) {
        console.log(e)
        res.send(e)
    }
})

app.post("/user/login", async (req, res)=>{
  const users = db.collection("userInfo")
  let email = req.body.email
  let password = req.body.password
  try { 
    await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const uid = user.uid
            console.log(uid)
            res.send(uid)
          })
        // let userData = []
        // users.get().then((querySnapshot)=>{
        //     querySnapshot.forEach((doc) => {
        //         let id = doc.id
        //         userData.push({ id, ...doc.data()})
        //     })
        //     res.send(userData)
        // })   
    }
    catch (e){
        console.log(e)
        res.send(e)
    }
})

app.put("/:shortUrl", (req, res) => { 
  const sLinks = db.collection('shortUrls')
  try {
    const shortUrlRef = sLinks.doc(req.params.shortUrl);
    shortUrlRef.update({
      fullUrl: req.body.fullUrl,
      urlTitle: req.body.urlTitle,
    });
    res.send({
      message: "Short url updated successfully",
      status: true,
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/:shortUrl", (req, res) => { 
  const sLinks = db.collection('shortUrls')
  try {
    const shortUrlRef = sLinks.doc(req.params.shortUrl);
    shortUrlRef.delete();
    res.send({
      message: "Short url deleted successfully",
      status: true,
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

