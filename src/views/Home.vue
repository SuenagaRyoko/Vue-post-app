<template>
  <div class="home container mw-980 is-fluid">
    <div class="box" v-for="post in posts" :key="post.id">
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img :src="post.imageUrl" alt="Image">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>{{ post.userName }}</strong>
              <br>
              {{ post.msg }}
              <br>
              <small>{{ post.createdAt }}</small>
            </p>
          </div>
        </div>
      </article>
    </div>

    <input-area @send-post="sendPost"/>
  </div>
</template>
<script>
import "bulma/css/bulma.css";
import firebase from "firebase";
import TheHeader from "../components/TheHeader";
import InputArea from "../components/InputArea";

export default {
  data() {
    return {
      uid: "",
      userName: "",
      accountName: "",
      posts: []
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.$router.push("/signin");
      } else {
        this.uid = user.uid;
        this.setCurrentUser();
        this.getPosts();
      }
    });
  },
  methods: {
    setCurrentUser() {
      const userRef = firebase
        .firestore()
        .collection("users")
        .doc(this.uid);
      userRef
        .get()
        .then(doc => {
          if (doc.exists) {
            this.userName = doc.data().userName;
            this.accountName = doc.data().accountName;
          }
        })
        .catch(error => {
          console.log("Error getting document:", error);
        });
    },
    getPosts() {
      const postRef = firebase.firestore().collection("posts");
      postRef
        .orderBy("createdAt", "desc")
        .get()
        .then(querySnapshot => {
          let docs = [];
          let querys = [];
          querySnapshot.forEach(doc => {
            console.log(doc.id, " => ", doc.data().createdAt.toDate());
            querys.push(
              firebase
                .firestore()
                .doc(doc.data().userRef)
                .get()
            );
            docs.push({
              id: doc.id,
              msg: doc.data().msg,
              createdAt: doc.data().createdAt.toDate(),
              userRef: doc.data().userRef,
              userName: "",
              imageUrl: "",
              accountName: ""
            });
          });
          const users = querys.reduce(
            (promise, user, index) =>
              user.then(res => {
                docs[index]["userName"] = res.data().userName;
                docs[index]["imageUrl"] = res.data().imageUrl;
                docs[index]["accountName"] = res.data().accountName;
              }),
            Promise.resolve()
          );

          users.then(() => {
            console.log("users", docs);
          });
          users.catch(error => {
            console.log(error);
          });

          return docs;
        })
        .then(docs => {
          this.posts = docs;
        });
    },
    sendPost(msg) {
      console.log(msg);
      const postRef = firebase.firestore().collection("posts");
      postRef
        .add({
          msg,
          userRef: `users/${this.uid}`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    }
  },
  components: {
    TheHeader,
    InputArea
  }
};
</script>
<style scoped>
.mw-980 {
  max-width: 980px;
  margin: auto;
}
.home {
  margin-bottom: 160px;
}
.image img {
  width: 64px;
  height: 64px;
  object-fit: cover;
}
</style>