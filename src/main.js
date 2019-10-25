import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";
import router from "./router/index.js";

Vue.config.productionTip = false;

// Initialize Firebase
var config = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appID: "app-id"
};
firebase.initializeApp(config);

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
