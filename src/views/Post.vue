<template>
  <div class="post container mw-980 is-fluid">
    <div class="box">
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
        <div v-if="post.accountName == accountName" class="post-dropdown-btn" :class="{'is-open':isOpen}" @click="toggleDropdown">
          <span>…</span>
          <div class="post-dropdown">
            <ul>
              <li>
                <a @click="deletePost">削除</a>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </div>
    <h2>返信</h2>
    <router-link :to="'/post/' + comment.id" class="box" v-for="comment in comments" :key="comment.id">
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img :src="comment.imageUrl" alt="Image">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>{{ comment.userName }}</strong>
              <br>
              {{ comment.msg }}
              <br>
              <small>{{ comment.createdAt.toDate() }}</small>
            </p>
          </div>
        </div>
      </article>
    </router-link>
    <input-area
      @send-post="sendPost"
      :account-name="post.accountName"
      :postId="postId"
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
      postId: "",
      post: {},
      currentPageUser: {
        uid: "",
        userName: "",
        accountName: "",
        imageUrl: ""
      },
      comments: [],
      isOpen: false
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.$router.push("/signin");
      } else {
        this.uid = user.uid;
        this.postId = this.$route.path.replace("/post/", "");
        this.setUser();
        this.fetchPosts();
        this.fatchComments();
      }
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
    async fetchPosts() {
      try {
        const post = await this.fetchPost(`posts/${this.postId}`);
        const user = await this.fetchUser(post.userRef);
        const posts = {
          ...post,
          ...user
        };
        console.log('posts',posts);
        this.post = posts;
      } catch (error) {
        console.log(error);
        
      }
    },
    async fatchComments() {
      try {
        const commentsRef = firebase.firestore().collection("comments").doc(this.postId);
        commentsRef.onSnapshot(async (querySnapshot) => {
          const commentsQuery = await querySnapshot.data().posts;

          let comments = [];
          let post = [];
          let user = [];

          for (let i = 0; i < commentsQuery.length; i++) {
            post = await this.fetchPost(commentsQuery[i]);
            user = await this.fetchUser(post.userRef);
            comments.push({ ...post, ...user });
          }

          this.comments = comments;
        });
      } catch (error) {
        console.log(error);
        
      }
    },
    async fetchPost(ref) {
      const postRef = firebase.firestore().doc(ref);
      const post = await postRef.get();
      const data = {
        id: post.id,
        ...post.data()
      }
      return data;
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
    toggleDropdown() {
      if (this.isOpen) {
        this.isOpen = false;
      }else{
        this.isOpen = true;
      }
    },
    deletePost() {
      const postRef = firebase.firestore().collection("posts");
      postRef
        .doc(this.post.id)
        .delete()
        .then(() => {
          this.$router.push("/");
        }).catch((error) => {
          console.log(error);
        });
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
}
.post.container {
  margin: 40px auto 160px;
}
a.box:hover {
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
}
.image img {
  width: 64px;
  height: 64px;
  object-fit: cover;
}
.post-dropdown-btn{
  position: relative;
}
.post-dropdown{
  position: absolute;
  right: 0;
  display: none;
  width: 100px;
  border: 1px solid #ddd;
}
.post-dropdown a{
  display: inline-block;
  width: 100%;
  padding: 8px 16px;
  color: #2c3e50;
}
.post-dropdown a:hover{
  color: #fff;
  background: #6c92d0;
}
.is-open.post-dropdown-btn .post-dropdown{
  display: block;
}
</style>