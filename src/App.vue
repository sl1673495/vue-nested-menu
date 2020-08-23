<template>
  <nest-menu :data="data" :activeIds="ids" @change="activeIdsChange" />
</template>

<script>
import { ref } from "vue";
import NestMenu from "./components/NestMenu.vue";
import data from "./menu.js";
import { getSubIds } from "./util";

export default {
  name: "App",
  setup() {
    // 假设默认选中 id 为 7
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

    const ids = ref(findPath(data, activeId));

    const activeIdsChange = (newIds) => {
      ids.value = newIds;
      console.log("当前选中的id路径", newIds);
    };

    return {
      ids,
      activeIdsChange,
      data,
    };
  },
  components: {
    NestMenu,
  },
};
</script>