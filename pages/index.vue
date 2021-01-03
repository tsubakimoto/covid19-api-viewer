<template>
  <b-container>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/">covid19-api-viewer</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/login">ログイン</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-jumbotron header="covid19-api-viewer">
      <p>Nuxt.jsの練習アプリ</p>
      <nuxt-link to="apis" class="btn btn-primary btn-lg">
        APIs
      </nuxt-link>
      <a
        href="https://github.com/tsubakimoto/covid19-api-viewer"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-dark btn-lg"
      >
        GitHub
      </a>
    </b-jumbotron>
  </b-container>
</template>

<script>
export default {}
</script>
