<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/">
        <Logo />
        covid19-api-viewer
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item @click="signIn()">ログイン</b-nav-item>
        <b-nav-item @click="signOut()">ログアウト</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <Nuxt />
  </div>
</template>

<script>
import mymsal from "~/modules/msal";

const msal = new mymsal();
const myMSALObj = msal.myMSALObj;
const loginRequest = msal.loginRequest;

let accessToken;

export default {
  created: function () {
    // console.log("this is onload event.", myMSALObj, loginRequest);
  },
  methods: {
    signIn: function () {
      console.log("this is signin method.");
      myMSALObj.loginRedirect(loginRequest);
    },
    signOut: function () {
      console.log("this is signout method.");
      myMSALObj.logout();
    },
  },
};
</script>