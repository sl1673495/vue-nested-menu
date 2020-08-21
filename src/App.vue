<template>
  <nest-menu :data="menu" @change="activeIdsChange" />
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
    activeIdsChange(ids) {
      console.log("当前选中的id路径", ids);
    },
  },
  components: {
    NestMenu,
  },
};
</script>
