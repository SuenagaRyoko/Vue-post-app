<template>
  <div class="signin container is-fluid mw-980">
    <h1>ログイン</h1>
    <div class="field">
      <p class="control">
         <input class="input"
           type="email"
           placeholder="Email"
           v-model="email"
         />
      </p>
    </div>
    <div class="field">
      <p class="control">
         <input
           class="input"
           type="password"
           placeholder="Password"
           v-model="password"
         />
      </p>
    </div>
    <div class="field">
      <p class="control">
         <button class="button is-success" @click="login">
           ログイン
         </button>
      </p>
    </div>
    <router-link to="/signup">アカウントを登録</router-link>
  </div>
</template>
<script>
import 'bulma/css/bulma.css'
import firebase from 'firebase'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      const isLogin = firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
      isLogin
        .then((user) => {
          if (user) {
            this.$router.push('/')
          }else{
            return
          }
        })
        .catch((error) => {
          throw error;
        })
    }
  }
}
</script>
<style scoped>
.mw-980{
  max-width: 980px;
  margin: auto;
}
</style>


