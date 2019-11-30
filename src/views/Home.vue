<template>
  <div class="home mw-980 is-fluid">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="toggleNavbar"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu" :class="{'is-open':isOpen}">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <router-Link v-if="!uid" to="/signup" class="button is-primary">
                <strong>Sign up</strong>
              </router-Link>
              <a v-if="uid" class="button is-light" @click="signout">
                sign out
              </a>
              <router-Link v-else to="/signin" class="button is-light">
                sign in
              </router-Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="posts">
      <router-link :to="'/post/' + post.id" class="box" v-for="post in posts" :key="post.id">
        <article class="media">
          <div class="media-left">
            <router-link :to="'/user/' + post.accountName">
              <figure class="image is-64x64">
                <img :src="post.imageUrl" alt="Image">
              </figure>
            </router-link>
          </div>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ post.userName }}</strong><small>{{ `@${post.accountName}` }}</small>
                <br>
                {{ post.msg }}
                <br>
                <small>{{ post.createdAt.toDate() }}</small>
              </p>
            </div>
          </div>
        </article>
      </router-link>
    </div>

    <input-area
      v-if="uid"
      @send-post="sendPost"
      :account-name="null"
      :post-id="null"
    />
  </div>
</template>
<script>
import "bulma/css/bulma.css";
import firebase from "firebase";
import InputArea from "../components/InputArea";

export default {
  data() {
    return {
      uid: "",
      userName: "",
      accountName: "",
      posts: [],
      isOpen: false
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.uid = "";
      } else {
        this.uid = user.uid;
        this.setUser();
      }
      this.fetchPosts();
    });
  },
  methods: {
     async setUser() {
      try {
        const userRef = firebase.firestore().collection("users").doc(this.uid);
        const currentUser = await userRef.get();
        if (currentUser.exists) {
          this.userName = currentUser.data().userName;
          this.accountName = currentUser.data().accountName;
        }
      } catch (error) {
        console.log(error);
      }
    },
    fetchPosts() {
      try {
        const postRef = firebase.firestore().collection("posts");
        postRef
          .where("parentPost", "==", null)
          .orderBy("createdAt", "desc")
          .onSnapshot( async (querySnapshot) => {
            let posts = [];
            const docs = await querySnapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data()
              }
            })

            let user = [];
            for (let i = 0; i < docs.length; i++) {
              user = await this.fetchUser(docs[i].userRef);
              posts.push({
                ...docs[i],
                ...user
              });
            }

            this.posts = posts;
          });
      } catch (error) {
        console.log(error);
        
      }
    },
    async fetchUser(ref) {
      const userRef = firebase.firestore().doc(ref);
      const user = await userRef.get();
      const data = {
        uid: user.id,
        ...user.data()
      }
      return data;
    },
    async sendPost(msg, postId) {
      try {
        const postRef = firebase.firestore().collection("posts");
        const commentsRef = firebase.firestore().collection("comments");
        const addComment = await postRef
          .add({
            msg,
            userRef: `users/${this.uid}`,
            parentPost: postId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        if (postId) {
          commentsRef
            .doc(postId)
            .set({
              posts: firebase.firestore.FieldValue.arrayUnion(`posts/${addComment.id}`)
            }, { merge: true });
        }
      } catch (error) {
        console.log(error);
      }
    },
    signout() {
      firebase.auth().signOut().then(() => {
        this.uid = "";
      }).catch(function(error) {
        console.log(error);
      });
    },
    toggleNavbar() {
      if (this.isOpen) {
        this.isOpen = false;
      }else{
        this.isOpen = true;
      }
    }
  },
  components: {
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
.posts{
  margin: 16px;
}
.posts a:hover {
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
}
.image img {
  width: 64px;
  height: 64px;
  object-fit: cover;
}
.is-open{
  display: block;
}
</style>