import { getAuth,  signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import express from 'express';
import cors from 'cors';
import { db } from '../server/config/db.js';
import { auth } from '../server/config/config.js';


const app = express();
const port = 8080;
const sLinks = db.collection('shortUrls')
// const cors = require('cors');
// const router = express.Router();

// const admin = require("firebase-admin");
// const users = db.collection("user") 

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

const db = admin.firestore();

// //Handle routes
// app.get("/", (req, res) => {
//   res.sendFile("../client/src/views/HomeView.vue");
// });


// app.get("/popular", (req, res) => {
//   res.send("This page is under construction!");
// });

const isAbsoluteUrl = (url) => /^[a-z][a-z0-9+.-]*:/.test(url);

app.post("/api/shortened", async (req, res) => {

  
  // const { href } = req.body.fullUrl;

  // let shortUrl = "";
  // const possible =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // for (let i = 0; i < 5; i++) {
  //   shortUrl += possible.charAt(Math.floor(Math.random() * possible.length));
  // }

  // if (isAbsoluteUrl(href)) {
    try {
      let shortUrl = "";

      const doc = await sLinks.doc('shortUrl').get();
      if (doc.exists) {
        console.log("Short URL already exists!");
      } else {
        sLinks.doc('shortUrl').set({
          fullUrl: req.body.fullUrl,
          sUrl: req.body.sUrl,
          viewCount: req.body.viewCount,
        });
        res.send({ shortUrl });
      }
    } catch (error) {
      console.log(error);
    }
  // } else {
  //   console.log("Please enter valid url!");
  // }
});

// app.post("/api/shortened", async (req,res) =>{

//   let shortUrl = "";
//   const possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//   for (let i = 0; i < 5; i++) {
//     shortUrl += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
  
//   try {
//       sLinks.add({
//         fullUrl: req.body.fullUrl,
//         shortUrl: shortUrl,
//         viewCount: req.body.viewCount
//       })
//       res.send({
//           status:true,
//           message:"Data added succesfully"
//       })
//   }
//   catch(err){
//       console.log("Error : ", err);
//   }
// })

app.get("/:shortUrl", async (req, res) => {
  // const links = [];
  // try{
  //   const querySnapshot = await db.collection("shortUrls").get();
  //   querySnapshot.forEach((doc) => {
  //     links.push(doc.data());
  //   });
  //   console.log(links);
  // } catch (error) {
  //   console.log(error);
  // }

  const { shortUrl } = req.params;
  const shortUrlRef = db.collection("shortUrls").doc(shortUrl);
  const doc = await shortUrlRef.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    const { fullUrl } = doc.data();
    res.redirect(fullUrl)
    // res.send({ fullUrl });
    // incrementviewCount(shortUrlRef);
    
  }
});

app.get("/api/shortened", async (req, res) => {
  const shortLinks = [];
  try {
    let shortLinks = []
    sLinks.get().then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                let id = doc.id
                shortLinks.push({ id, ...doc.data()})
                // incrementviewCount(id)
                // const increment = admin.firestore.FieldValue.increment(1);
                // sLinks.doc(id).update({ viewCount: increment });
            })
            res.send(shortLinks)
        })
    } catch(err) {
      console.log(err)
    }
 });

// app.post("/user/register", async (req, res) => {
//   try {
//   // const { email, password } = req.body;
//   //   const user = await admin.auth().createUser({
//   //   email,
//   //   password
//   // });
//   // res.send(user);
//   users.add({
//     email: req.body.email,
//     password: req.body.password
//   })
//     res.send({
//     status: true,
//     message: "Succesfully created user"
//   })
// }
//   catch (e) {
//     console.log(e)
//   }
// });

app.post("/user/register", (req, res)=>{
  // const users = db.collection("userInfo")
  let email = req.body.email
  let password = req.body.password
  try {
    const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
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
    }
})

app.post("/user/login", (req, res)=>{
  const users = db.collection("userInfo")
  let email = req.body.email
  let password = req.body.password
  try { 
    signInWithEmailAndPassword(auth, email, password)
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
    }
})

app.delete("/:shortUrl", (req, res) => {

  try{
      sLinks.doc(req.params.shortUrl).delete().then(()=>{
          res.send({
              message: "Data succesfully deleted"
          })
      })
  }
  catch(err){
      console.log(err)
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


