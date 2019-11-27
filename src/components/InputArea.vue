<template>
  <div class="input-area" :class="{ 'show-buttons': showBtn }">
    <div class="form">
      <textarea
        class="textarea"
        :class="{ 'focus': textareaFocus }"
        placeholder="今何してる？"
        v-model="msg"
        @focus="showForm"
      ></textarea>
      <button class="button" @click="hideForm">キャンセル</button>
      <button class="button is-info is-outlined" @click="postMsg">送信</button>
    </div>
  </div>
</template>
<script>
import "bulma/css/bulma.css";

export default {
  props: {
    accountName: String,
    postId: String
  },
  data() {
    return {
      msg: "",
      showBtn: false,
      textareaFocus: false
    };
  },
  methods: {
    postMsg() {
      this.$emit("send-post", this.msg, this.postId);
      this.showBtn = false;
      this.msg = "";
    },
    showForm() {
      if (this.accountName) {
        this.msg = `@${this.accountName} `;
      }
      this.showBtn = true;
      this.textareaFocus = true;
    },
    hideForm() {
      this.showBtn = false;
      this.textareaFocus = false;
    }
  }
};
</script>
<style scoped>
.input-area {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  padding: 1rem;
  background: #fff;
  box-sizing: border-box;
  transform: translate(0, 5em);
  transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -webkit-transition: 0.5s ease-in-out;
}
.input-area.show-buttons {
  transform: translate(0, 0);
  transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -webkit-transition: 0.5s ease-in-out;
}
.input-area .textarea {
  min-height: 3em;
  transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -webkit-transition: 0.5s ease-in-out;
}
.input-area .textarea.focus {
  min-height: 10em;
  transition: 0.5s ease-in-out;
  -o-transition: 0.5s ease-in-out;
  -moz-transition: 0.5s ease-in-out;
  -webkit-transition: 0.5s ease-in-out;
}
.input-area .button {
  margin: 1rem;
}
</style>
