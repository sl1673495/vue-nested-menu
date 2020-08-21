<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <nest-menu :data="data" @change="activeIdChange" :defaultActiveIds="ids" />
</template>

<script>
import NestMenu from "./components/NestMenu.vue";
import data from "./menu.js";

export default {
  name: "App",
  data() {
    const activeId = 7;

    const findPath = (menus, targetId) => {
      let ids;

      const traverse = (subMenus, prev) => {
        if (ids) {
          return;
        }
        if (!subMenus) {
          return;
        }
        subMenus.forEach((subMenu) => {
          if (subMenu.id === activeId) {
            ids = [...prev, activeId];
            return;
          }
          traverse(subMenu._child, [...prev, subMenu.id]);
        });
      };

      traverse(menus, []);

      return ids;
    };

    const ids = findPath(data, activeId);
    console.log('ids: ', ids);

    return {
      data,
      ids,
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
