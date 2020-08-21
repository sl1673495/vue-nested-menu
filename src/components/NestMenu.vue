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
      :data="getActiveSubMenu()"
      :depth="depth + 1"
      :defaultActiveIds="defaultActiveIds"
      @change="onSubActiveIdChange"
    ></nest-menu>
  </div>
</template>

<script lang="ts">
import { watch, ref } from "vue";
import data from "../menu";

interface IProps {
  data: typeof data;
  depth: number;
  defaultActiveIds?: number[];
}

export default {
  name: "NestMenu",
  props: ["data", "depth", "defaultActiveIds"],
  setup(props: IProps, context) {
    console.log('props: ', props);
    const { depth = 0, defaultActiveIds } = props;
    const defaultActiveId = defaultActiveIds ? defaultActiveIds[depth] : null;
    const activeId = ref<number | null | undefined>(defaultActiveId);

    const onMenuItemClick = (menuItem) => {
      activeId.value = menuItem.id;
    };
    /**
     * 接受到子组件更新 activeId 的同时
     * 需要作为一个中介告知父组件 activeId 更新了
     */
    const onSubActiveIdChange = (ids) => {
      context.emit("change", [activeId.value].concat(ids));
    };

    /**
     * 样式相关
     */
    const getActiveSubMenu = () => {
      return props.data.find(({ id }) => id === activeId.value)?._child;
    };
    const getActiveClass = (id) => {
      if (id === activeId.value) {
        return "menu-active";
      }
      return "";
    };

    /**
     * 菜单数据源发生变化的时候 默认选中当前层级的第一项
     */
    watch(
      () => props.data,
      (newData) => {
        if (!activeId.value) {
          if (newData && newData.length) {
            activeId.value = newData[0].id;
          }
        }
      },
      {
        immediate: true,
      }
    );

    /**
     * 递归收集子菜单第一项的 id
     */
    const getSubIds = (child) => {
      const subIds = [];
      const traverse = (data) => {
        if (data && data.length) {
          const first = data[0];
          subIds.push(first.id);
          traverse(first._child);
        }
      };
      traverse(child);
      return subIds;
    };

    watch(
      () => activeId.value,
      (newId) => {
        // 这里需要递归找到这层菜单以下的子菜单的 activeId 拼接在后面
        // 直接默认找第一个即可
        const child = getActiveSubMenu();
        const subIds = getSubIds(child);
        // 把子菜单的 ids 也拼接起来 向父组件 emit
        context.emit("change", [newId, ...subIds]);
      }
    );

    return {
      depth,
      activeId,
      onMenuItemClick,
      getActiveSubMenu,
      getActiveClass,
      onSubActiveIdChange,
    };
  },
};
</script>

<style>
.menu-wrap-0 {
  background: #ffccc7;
}

.menu-wrap-1 {
  background: #fff7e6;
}

.menu-wrap-2 {
  background: #fcffe6;
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
  color: #f5222d;
}
</style>