<template>
  <div id="app" class="container grid-lg mb-2">
    <header class="navbar">
      <section class="navbar-section">
        <router-link class="btn btn-link" to="/" :q="''">Home</router-link>
        <router-link class="btn btn-link" to="/about">About</router-link>
      </section>
    </header>
    <router-view />
  </div>
</template>

<style src="spectre.css/dist/spectre.css"></style>
<style src="spectre.css/dist/spectre-icons.css"></style>
<style>
.navbar {
  margin-bottom: 1em;
}

.navbar-section *:last-child {
  margin-left: auto;
}

/* .navbar a.router-link-exact-active {
  color: #42b983;
} */
</style>
