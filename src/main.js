import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router/index.js";

Vue.config.productionTip = false;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC6bbOCIiO38jgcZ9dogZngrwRbRjR5RZI",
  authDomain: "ponkotsu-f7ff6.firebaseapp.com",
  databaseURL: "https://ponkotsu-f7ff6.firebaseio.com",
  projectId: "ponkotsu-f7ff6",
  storageBucket: "ponkotsu-f7ff6.appspot.com",
  messagingSenderId: "895373790995",
  appId: "1:895373790995:web:3e3cb590f3bd725c5794e6"
};
firebase.initializeApp(config);

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
