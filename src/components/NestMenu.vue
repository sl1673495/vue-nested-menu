<template>
  <div class="wrap">
    <div class="menu-wrap" :class="`menu-wrap-${depth}`">
      <div
        class="menu-item"
        v-for="menuItem in data"
        :class="getActiveClass(menuItem.id)"
        @click="onMenuItemClick(menuItem)"
        :key="menuItem.id"
      >{{menuItem.name}}</div>
    </div>
    <nest-menu
      :key="activeId"
      v-if="activeId"
      :defaultActiveIds="defaultActiveIds"
      :data="getActiveSubMenu()"
      :depth="depth + 1"
      @change="activeIdChange"
    ></nest-menu>
  </div>
</template>

<script>
export default {
  name: "NestMenu",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    depth: {
      type: Number,
      default: 0,
    },
    defaultActiveIds: {
      type: Array,
    },
  },
  data() {
    let defaultActiveId = null;
    if (this.defaultActiveIds) {
      defaultActiveId = this.defaultActiveIds[this.depth];
      this.defaultActiveIds[this.depth] = null;
    }
    return {
      activeId: defaultActiveId,
    };
  },
  created() {},
  methods: {
    onMenuItemClick(menuItem) {
      this.activeId = menuItem.id;
    },
    getActiveSubMenu() {
      const menu = this.data.find(({ id }) => id === this.activeId);
      if (menu) {
        return menu._child;
      }
      return null;
    },
    getActiveClass(id) {
      if (id === this.activeId) {
        return "menu-active";
      }
      return "";
    },
    activeIdChange(ids) {
      this.$emit("change", [this.activeId].concat(ids));
    },
  },
  watch: {
    data: {
      handler(newData) {
        if (!this.activeId) {
          if (newData && newData.length) {
            this.activeId = newData[0].id;
          }
        }
      },
      immediate: true,
    },
    activeId(newId) {
      // 这里需要找到这层菜单以下的子菜单的 activeId 拼接在后面
      // 直接默认找第一个即可
      const child = this.getActiveSubMenu();
      const subIds = [];
      const traverse = (data) => {
        if (data && data.length) {
          const first = data[0];
          subIds.push(first.id);
          traverse(first._child);
        }
      };
      traverse(child);
      this.$emit("change", [newId, ...subIds]);
    },
  },
};
</script>

<style>
.menu-wrap-0 {
  background: rosybrown;
}

.menu-wrap-1 {
  background: skyblue;
}

.wrap {
  padding: 12px 0;
}

.menu-wrap {
  display: flex;
}

.menu-item {
  margin-left: 16px;
  cursor: pointer;
}

.menu-active {
  color: red;
}
</style>