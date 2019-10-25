import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router/index.js";

Vue.config.productionTip = false;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB3uADgRQKt-t0aaQW8RhjGUVQ1EzCItpw",
  authDomain: "post-app-3e7ff.firebaseapp.com",
  databaseURL: "https://post-app-3e7ff.firebaseio.com",
  projectId: "post-app-3e7ff",
  storageBucket: "post-app-3e7ff.appspot.com",
  messagingSenderId: "264718445679",
  appId: "1:264718445679:web:424dc5fe9e124118e2b19a",
  measurementId: "G-YZXZJZEGW3"
};
firebase.initializeApp(config);

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
