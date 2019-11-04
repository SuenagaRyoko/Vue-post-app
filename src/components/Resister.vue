<template>
  <div class="resister container is-fluid mw-980">
    <h2>ユーザー情報登録</h2>
    <div class="field">
      <p class="control">
        <input
          class="input"
          type="text"
          placeholder="Account name"
          v-model="accountName"
          @change="idExists(); accountNameEntered()"
        >
      </p>
    </div>
    <div class="field">
      <p class="control">
        <input
          class="input"
          type="text"
          placeholder="User name"
          v-model="userName"
          @change="userNameEntered()"
        >
      </p>
    </div>
    <div class="field">
      <div class="control">
        <div class="file">
          <label class="file-label">
            <input class="file-input" type="file" @change.prevent="uploadFile">
            <span class="file-cta">
              <span class="file-label">サムネイルを選択…</span>
            </span>
          </label>
        </div>
      </div>
    </div>
    <div class="field">
      <p class="control">
        <button class="button" @click="isValid">登録</button>
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
      isAccountNameFocused: false,
      validate: { 
        required: [
            { accountName: false },
            { userName: false },
            { image: false }
        ],
        unique: [
            { accountName: false }
        ]
      }
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
    accountNameEntered() {
      if (this.accountName) {
        this.validate.required[0].accountName = true;
      } else {
        this.validate.required[0].accountName = false;
      }
    },
    userNameEntered() {
      if (this.userName) {
        this.validate.required[1].userName = true;
      } else {
        this.validate.required[1].userName = false;
      }
    },
    idExists() {
      this.isAccountNameFocused = true;
      const userRef = firebase.firestore().collection("users");

      userRef
        .where("accountName", "==", this.accountName)
        .get()
        .then(docs => {
          if (docs.size) {
            console.log(this.validate.unique[0].accountName);
            this.validate.unique[0].accountName = false;
            this.isAccountNameFocused = false;
          } else {
            this.validate.unique[0].accountName = true;
            console.log("this accountName is unique!");
            console.log(this.validate.unique[0].accountName);
            this.isAccountNameFocused = false;
          }
        })
        .catch(error => {
          throw error;
        });
    },
    uploadFile(e) {
      let files = e.target.files;
      const fr = new FileReader();

      fr.readAsDataURL(files[0]);
      fr.addEventListener("load", () => {
        if (files[0]) {
          if (files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
            this.imageFile = files[0];
            this.imageName = files[0].name;
            console.log(`uploaded image! => ${this.imageName}`);
            this.validate.required[2].imageRequire = true;
          }
        }
        this.validate.required[2].imageRequire = false;
      });
    },
    isValid() {
      if (this.isAccountNameFocused) {
        console.log("AccountNameFocused");
        return;
      }
      let isRequired = this.validate.required.some((rule) => {
        for (let inputItem in rule) {
          if (!rule.hasOwnProperty(inputItem)) {
            return false;
          }
          if (!rule[inputItem]) {
            return false;
          }
        }
        return rule;
      });
      console.log(`isRequired:${isRequired}`);
      
      let isUnique = this.validate.unique.some((rule) => {
        for (let inputItem in rule) {
          if (!rule.hasOwnProperty(inputItem)) {
            return false;
          }
          if (!rule[inputItem]) {
            return false;
          }
        }
        return rule;
      });
      console.log(`isUnique:${isUnique}`);
      
      if (isRequired && isUnique) {
        this.resister();
      }
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
              throw error;
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