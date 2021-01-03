<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/">
        <Logo />
        covid19-api-viewer
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/login">ログイン</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <Nuxt />
  </div>
</template>

<style>
</style>
