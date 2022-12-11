<template>

  <div class="jumbotron" style="margin-top: 25px; margin-left: 50px; margin-right: 50px;">
  <h1 class="display-5">Hello, World!</h1>

  <button type="button" @click="logout()" class="btn btn-primary">Log Out</button> 

  <hr class="my-4">
  <div class="card" style="width: 30rem;">
    <div class="card-body">
      <h5 class="card-title">Shorten URL</h5>
      <form>
        <div class="form-row align-items-center">
          <div class="col-auto">
            <label class="sr-only" for="inlineFormInput">Enter Title here</label>
            <input type="text" class="form-control mb-2" id="inlineFormInput" v-model="urlTitle" placeholder="Title">
          </div>
          <div class="col-auto">
            <label class="sr-only" for="inlineFormInput">Enter URL here</label>
            <input type="text" class="form-control mb-2" id="inlineFormInput" v-model="fullUrl" placeholder="my.its.ac.id">
          </div>
          <div class="col-auto">
            <label class="sr-only" for="inlineFormInput">Enter Short URL here</label>
            <input type="text" class="form-control mb-2" id="inlineFormInput" v-model="shortUrl" placeholder="itscampus">
          </div>
          <div class="col-auto">
            <!-- <label class="sr-only" for="inlineFormInputGroup">Enter Short Link</label> -->
            <!-- <div class="input-group mb-2">
              <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="myITS">
            </div> -->
          </div>
          <div class="col-auto">
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary mb-2" @click="postDetails()">Shorten</button>
          </div>
        </div>  
      </form>
    </div>
  </div>

  <br>

    <div class="d-grid gap-3">
    <div class="card d-grid gap-3 p-2" v-for="(links) in shortLinks" :key="links.shortUrl" style="width: 30rem;">
      <div class="card-body">
      <h5 class="card-title">{{ links.urlTitle }}</h5>
        <a class="card-text" :href="'http://localhost:8080/'+ links.shortUrl">http://localhost:8080/{{ links.shortUrl }}</a>
        <!-- <p class="card-text" @click="$router.push('/:{{ links.shortUrl }}')">http://localhost:8080/{{ links.shortUrl }}</p> -->
        <p class="card-text">{{ links.viewCount }}</p>
        <a href="#" class="btn btn-danger" v-if="!links.showEdit" @click="deleteDetails(links.shortUrl)">Delete</a>
        <a href='#' class="btn btn-secondary" v-if="!links.showEdit" @click="links.showEdit = !links.showEdit">Edit</a>
        <div v-if="links.showEdit">
          <!-- <div class="col-auto">
            <label class="sr-only" for="inlineFormInput">Enter New URL here</label>
            <input type="text" class="form-control mb-2" id="inlineFormInput" v-model="newfullUrl" placeholder="my.its.ac.id">
          </div> -->
          <div class="col-auto">
            <label class="sr-only" for="inlineFormInput">Enter New Title here</label>
            <input type="text" class="form-control mb-2" id="inlineFormInput" v-model="newurlTitle" placeholder="MyITS">
          </div>
          <div class="col-auto">
            <label class="sr-only" for="inlineFormInput">Enter New URL here</label>
            <input type="text" class="form-control mb-2" id="inlineFormInput" v-model="newfullUrl" placeholder="my.its.ac.id">
          </div>
        <a href="#" class="btn btn-danger" @click="links.showEdit = !links.showEdit">Cancel</a>
        <a href='#' class="btn btn-secondary" @click="updateDetails(links.shortUrl)">Update</a>
        </div>
      </div>
    </div>
    </div>
  

  </div>

</template>

<script>
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCkDyhh8uj0JUDRcpxqUMZUg8OKK1HI1Xk",
  authDomain: "url-short-29989.firebaseapp.com",
  databaseURL: "https://url-short-29989-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "url-short-29989",
  storageBucket: "url-short-29989.appspot.com",
  messagingSenderId: "127323251574",
  appId: "1:127323251574:web:fde44de6a9227002389057"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default {
  data() {
    return {
      urlTitle: "",
      shortUrl: "",
      fullUrl: "",
      viewCount: 0,
      showEdit: false,
      shortLinks: [],
      newfullUrl: "",
      newurlTitle: "",
    }
  },
  
  beforeMount() {
    this.check();
  },
  methods: {
    

    async postDetails() {
      const res = await axios.post("http://localhost:8080/api/post", {
        urlTitle: this.urlTitle,
        shortUrl: this.shortUrl,
        fullUrl: this.fullUrl,
        viewCount: this.viewCount
      })
      .then((response) => {
        console.log(response);
      })
      this.shortLinks = []
      this.getDetails()
    },
    
      async getDetails() {
      const res = await axios.get("http://localhost:8080/api/get")
      this.shortLinks = res.data
      console.log(this.shortLinks)
    },

    async deleteDetails(shortUrl) {
      console.log(shortUrl)
      const res = await axios.delete(`http://localhost:8080/${shortUrl}`)
      .then((response) => {
        console.log(response);
      })
      this.shortLinks = []
      this.getDetails()
    },

    async updateDetails(shortUrl) {
      console.log(shortUrl)
      const res = await axios.put(`http://localhost:8080/${shortUrl}`, {
        urlTitle: this.newurlTitle,
        fullUrl: this.newfullUrl,
      }) 
      .then((response) => {
        console.log(response);
      }) 
      this.getDetails()
    },
    
    logout(){
            try 
            {
              // const auth = getAuth()
                signOut(auth)
                .then(() => {
                    localStorage.removeItem('uid')
                    console.log('lah keluar bang')
                    this.$router.push('/')
                })
                .catch((e) => {
                    console.log(e)
                })
            } 
            catch (e) 
            {
                console.log(e)
            } 
        },
        check() {
            if (localStorage.getItem('uid') == null || localStorage.getItem('uid') == '') {
                this.$router.push('/')
            }
            else
            {
                // this.$router.push(`/user/${localStorage.getItem('uid')}`)
            }
        }
  },
  mounted() {
    this.getDetails();
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .dashboard {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
