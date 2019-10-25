<template>
  <div class="resister container is-fluid mw-980">
    <h2>ユーザー情報登録</h2>
    <p v-if="idError" class="help is-danger">{{ idError }}</p>
    <div class="field">
      <p class="control">
        <input
          class="input"
          type="text"
          placeholder="Account name"
          v-model="accountName"
          @change="idExists"
        >
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input class="input" type="text" placeholder="User name" v-model="userName">
      </p>
    </div>
    <div class="field">
      <div class="control">
        <div class="file">
          <label class="file-label">
            <input class="file-input" type="file" name="resume" @change.prevent="selectFile">
            <span class="file-cta">
              <span class="file-label">サムネイルを選択…</span>
            </span>
          </label>
        </div>
      </div>
    </div>
    <p v-if="resisterError" class="help is-danger">{{ resisterError }}</p>
    <div class="field">
      <p class="control">
        <button class="button" @click="resister">登録</button>
      </p>
    </div>
  </div>
</template>
<script>
import "bulma/css/bulma.css";
import firebase from "firebase";

export default {
  data() {
    return {
      uid: "",
      accountName: "",
      userName: "",
      imageName: "",
      imageUrl: "",
      imageFile: "",
      idError: ""
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.$router.push("/signin");
      } else {
        this.uid = user.uid;
      }
    });
  },
  methods: {
    idExists() {
      const userRef = firebase.firestore().collection("users");

      userRef
        .where("accountName", "==", this.accountName)
        .get()
        .then(docs => {
          docs.forEach(doc => {
            if (doc.exists) {
              this.idError = "このアカウント名は既に存在しています";
            } else {
              console.log("No such document!");
            }
          });
        })
        .catch(error => {
          console.log("Error getting document:", error);
        });
    },
    selectFile(e) {
      let files = e.target.files;

      this.imageName = files[0].name;

      const fr = new FileReader();

      fr.readAsDataURL(files[0]);
      fr.addEventListener("load", () => {
        this.imageUrl = fr.result;
        this.imageFile = files[0];
      });
    },
    resister() {
      const userRef = firebase.firestore().collection("users");

      let inputData = {
        accountName: this.accountName,
        userName: this.userName
      };

      firebase
        .storage()
        .ref()
        .child(`${this.uid}/thumbnail/${this.imageName}`)
        .put(this.imageFile)
        .then(snapshot => {
          console.log("Uploaded a blob or file!");
          return snapshot.ref.getDownloadURL();
        })
        .then(downloadURL => {
          this.imageUrl = downloadURL;
          return this.imageUrl;
        })
        .then(imageUrl => {
          userRef
            .doc(this.uid)
            .set({ ...inputData, imageUrl })
            .then(() => {
              console.log("Document successfully written!");
              this.$router.push("/");
            })
            .catch(error => {
              console.error("Error writing document: ", error);
            });
        });
    }
  }
};
</script>
<style scoped>
.mw-980 {
  max-width: 980px;
  margin: auto;
}
</style>