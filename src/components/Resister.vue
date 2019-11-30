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
      <p v-if="!validate.required[0].accountName" class="help is-danger text-align-l">アカウント名を入力してください</p>
      <p v-if="!validate.unique[0].accountName" class="help is-danger text-align-l">そのアカウントは使用できません</p>
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
      <p v-if="!validate.required[1].userName" class="help is-danger text-align-l">アカウント名を入力してください</p>
    </div>
    <div class="field">
      <div class="file has-name">
        <label class="file-label">
          <input 
            class="file-input"
            type="file" name="resume"
            @change.prevent="uploadFile"
          >
          <span class="file-cta">
            <span class="file-label">
              サムネイルを選択…
            </span>
          </span>
          <span class="file-name">
            {{ imageName }}
          </span>
        </label>
      </div>
      <p v-if="!validate.required[2].image" class="help is-danger text-align-l">サムネイル画像をアップロードしてください</p>
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
      imageName: "画像を選択",
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
      if (this.accountName === 0 || this.accountName === null || this.accountName === "") {
        this.validate.unique[0].accountName = false;
        return;
      }
      userRef
        .where("accountName", "==", this.accountName)
        .get()
        .then(docs => {
          if (docs.size) {
            this.validate.unique[0].accountName = false;
            this.isAccountNameFocused = false;
          } else {
            this.validate.unique[0].accountName = true;
            console.log("this accountName is unique!");
            this.isAccountNameFocused = false;
          }
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    uploadFile(e) {
      const files = e.target.files;
      const fr = new FileReader();

      fr.readAsDataURL(files[0]);
      fr.addEventListener("load", () => {
        if (files[0]) {
          if (files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
            this.imageFile = files[0];
            this.imageName = files[0].name;
            this.validate.required[2].image = true;
          } else {
            this.validate.required[2].image = false;
          }
        } else {
          this.validate.required[2].image = false;
        }
      });
    },
    isValid() {
      if (this.isAccountNameFocused) {
        return;
      }
      const isRequired = this.validate.required.some((rule) => {
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

      const isUnique = this.validate.unique.some((rule) => {
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

      if (isRequired && isUnique) {
        this.resister();
      }
    },
    resister() {
      const userRef = firebase.firestore().collection("users");

      const inputData = {
        accountName: this.accountName,
        userName: this.userName
      };

      firebase
        .storage()
        .ref()
        .child(`${this.uid}/thumbnail/${this.imageName}`)
        .put(this.imageFile)
        .then(snapshot => {
          console.log("Uploaded file!");
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
              console.log(error.message);
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
.text-align-l{
  text-align: left;
}
</style>