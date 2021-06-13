<template>
  <v-app>
    <v-main>
      <v-app-bar>
        <v-spacer></v-spacer>
        <div>
          <v-btn plain>
            <router-link to="/">Home</router-link>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn plain>
            <router-link to="/about">About</router-link>
          </v-btn>
        </div>
      </v-app-bar>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
