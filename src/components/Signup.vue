<template>
  <div class="signin container is-fluid mw-980">
    <h1>新規登録</h1>
    <div class="field">
      <p class="control">
        <input class="input" type="email" placeholder="Email" v-model="email">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input class="input" type="password" placeholder="Password" v-model="password">
      </p>
    </div>
    <div class="field">
      <p class="control">
        <button class="button is-success" @click="signup">
          登録
        </button>
      </p>
    </div>
    <router-link to="/signin">ログイン</router-link>
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
    async signup() {
      const createUser = await firebase.auth()
      .createUserWithEmailAndPassword(this.email, this.password);

      if (createUser) {
        this.$router.push('/resister');
      }
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


