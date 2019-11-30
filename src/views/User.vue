<template>
  <div class="home container mw-980 is-fluid">
    
    <div class="user-image">
      <figure class="image is-64x64">
        <img :src="currentPageUser.imageUrl">
      </figure>
      <h1>{{ currentPageUser.userName }}</h1>
    </div>
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Tweets</p>
          <p class="title">{{ posts.length }}</p>
        </div>
      </div>
    </nav>
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
              <strong>{{ post.userName }}</strong><small>{{ `@${post.accountName}` }}</small>
              <br>
              {{ post.msg }}
              <br>
              <small>{{ post.createdAt.toDate() }}</small>
            </p>
          </div>
        </div>
      </article>
    </div>

    <input-area
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
      currentPageUser: {
        uid: "",
        userName: "",
        accountName: "",
        imageUrl: ""
      }
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.$router.push("/signin");
      } else {
        this.uid = user.uid;
        this.setUser();
        this.setCurrentPageUser();
      }
    });
  },
  methods: {
     async setUser() {
      const userRef = firebase.firestore().collection("users").doc(this.uid);
      const currentUser = await userRef.get();
      if (currentUser.exists) {
        this.userName = currentUser.data().userName;
        this.accountName = currentUser.data().accountName;
      }
      console.log(this.userName,this.accountName);
    },
    async setCurrentPageUser() {
      const currentUserAccountName = this.$route.path.replace("/user/", "");
      const userRef = firebase.firestore().collection("users");
      const currentPageUser = await userRef.where("accountName", "==", currentUserAccountName).get();
      currentPageUser.forEach((user) => {
        this.currentPageUser["uid"] = user.id;
        this.currentPageUser["userName"] = user.data().userName;
        this.currentPageUser["accountName"] = user.data().accountName;
        this.currentPageUser["imageUrl"] = user.data().imageUrl;
        this.fetchPosts();
      });
    },
    fetchPosts() {
      // const postRef = firebase.firestore().collection("posts");
      // postRef
      //   .where("userRef", "==", "users/" + this.currentPageUser.uid)
      //   .orderBy("createdAt", "desc")
      //   .onSnapshot( async (querySnapshot) => {
      //     let posts = [];
      //     const docs = querySnapshot.docs.map((doc) => {
      //       return {
      //         id: doc.id,
      //         ...doc.data()
      //       }
      //     })

      //     let user = [];
      //     for (let i = 0; i < docs.length; i++) {
      //       user = await this.fetchUser(docs[i].userRef);
      //       posts.push({
      //         ...docs[i],
      //         ...user
      //       });
      //     }
      //     console.log('posts', posts);
          
      //     this.posts = posts;
      //   });
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
    },
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
.user-image {
  margin: 16px 0;
}
.user-image .image{
  margin: auto;
}
.image img {
  width: 64px;
  height: 64px;
  object-fit: cover;
}
</style>