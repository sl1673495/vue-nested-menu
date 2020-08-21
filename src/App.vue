<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <nest-menu :data="menu" @change="activeIdChange"/>
</template>

<script>
import NestMenu from "./components/NestMenu.vue";
import menu from "./menu.js";

export default {
  name: "App",
  data() {
    return {
      menu,
    };
  },
  methods: {
    activeIdChange(ids) {
      console.log("当前选中的id路径", ids);
    },
  },
  components: {
    NestMenu,
  },
};
</script>
