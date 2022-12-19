
<template>
  <body>
    <div class="position-absolute top-50 start-50 translate-middle">
      <div class="card bg-light pt-1 pb-1 p-1 shadow" style="width: 18rem;">
        <div class="card-body">
        <label for="" class="card-text">Email</label><br>
        <input type="email" placeholder="Email" class="form-control" aria-describedby="emailHelp" v-model="email">
        <div v-show="invEmail">
          <p>
            Please input valid email.
          </p>
        </div>
        <p v-show="emailExist">
          This email is already taken! Anda yang jomblo
        </p>
        <label for="">Password</label><br>
        <input type="password" name="" id="" class="form-control" placeholder="Password" v-model="password">
        <div v-show="invPassword">
          <p>Please input valid password</p>
        </div>
        <div v-show="wrongPassword">
          <p>Your password is wrong</p>
        </div>
        <br>
        <button @click="loginSuccess(email, password)" class="btn btn-primary">Login</button>
        <div class="card-text">
          <p>Dont have an account yet? Register <RouterLink to="/register">here</RouterLink></p>
        </div>
      </div>
    </div>
    </div>    
  </body>
</template>

<script>
import { initializeApp } from "firebase/app"
import { getAuth,  signInWithEmailAndPassword } from "firebase/auth";
import axios from 'axios'

// const firebaseConfig = {
//   apiKey: "AIzaSyCkDyhh8uj0JUDRcpxqUMZUg8OKK1HI1Xk",
//   authDomain: "url-short-29989.firebaseapp.com",
//   databaseURL: "https://url-short-29989-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "url-short-29989",
//   storageBucket: "url-short-29989.appspot.com",
//   messagingSenderId: "127323251574",
//   appId: "1:127323251574:web:fde44de6a9227002389057"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

export default {
  data () {
    return {
      email: "",
      password: "",
      invEmail: false,
      invPassword: false,
      wrongPassword: false,
      emailExist: false    
    }
  },
  methods: {
    async loginSuccess(email, password){
      try {
        const res = await axios.post("http://localhost:8080/user/login", {
          email: this.email,
          password: this.password,
        }).then((response)=>{
          if(response.data.code == 'auth/invalid-email'){
            this.$router.push("/")
            this.invEmail = true
          }
          else if(response.data.code == 'auth/invalid-password'){
            this.$router.push("/")
            this.invPassword = true
          }
          else if(response.data.code == 'auth/internal-error'){
            this.$router.push("/")
            this.invPassword = true
          }
          else if(response.data.code == 'auth/user-not-found'){
            this.$router.push("/register")
            this.invEmail = true
          }
          else if(response.data.code == 'auth/wrong-password'){
            this.$router.push("/")
            this.wrongPassword = true
          }
          else if(response.data.code == 'auth/email-already-exists'){
            this.$router.push("/")
            this.emailExist = true
          }
          else if(response.data.code == 'auth/too-many-requests'){
            this.$router.push("/")
            this.wrongPassword = true
          }
          else if(response.data.code == 'auth/network-request-failed'){
            this.$router.push("/")
            console.log('Network error')
          }
          else {
            console.log(response)
            // Signed in 
            // const user = userCredential.user;
            const uid = response.data
            console.log(uid)
            localStorage.setItem('uid', uid)
            this.$router.push({ path: `/user/${uid}` });
            // ...
          console.log(response)
          }
        })
        } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
        // ..
      }
    }
  }
}
</script>

<style>

</style>
