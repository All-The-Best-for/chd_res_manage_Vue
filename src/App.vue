<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import MyMenu from './components/MyMenu/MyMenu.vue'
export default {
  name: 'App',
  components: {
    MyMenu
  },
  methods: {
    ...mapActions('myUserAbout',['getUserInfo']) ,
  },
  mounted () {
      this.getUserInfo()
  }
}
</script>

<style>
  html,body,#app {
    /* position: absolute; */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

</style>
