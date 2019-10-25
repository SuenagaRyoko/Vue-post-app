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
          Login
        </button>
      </p>
    </div>
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
    signup() {
      const createUser = firebase.auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        
        createUser.then((res) => {
          console.log('Create account: ', res.user.uid)
          this.$router.push('/resister')
        })
        .catch((error) => {
          console.log(error.message)
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


