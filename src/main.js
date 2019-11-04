import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router/index.js";

Vue.config.productionTip = false;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDy2Z7byDm6G7YXqj_idJ1uTGBlYn4HDP8",
  authDomain: "post-cfca2.firebaseapp.com",
  databaseURL: "https://post-cfca2.firebaseio.com",
  projectId: "post-cfca2",
  storageBucket: "post-cfca2.appspot.com",
  messagingSenderId: "175507536464",
  appId: "1:175507536464:web:19940500272829f5ea6f55",
  measurementId: "G-HL6NLCJ96D"
};
firebase.initializeApp(config);

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
