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
      v-if="subMenu && subMenu.length"
      :data="subMenu"
      :depth="depth + 1"
      :activeIds="activeIds"
      @change="onSubActiveIdChange"
    ></nest-menu>
  </div>
</template>

<script lang="ts">
import { watch, ref, onMounted, computed } from "vue";
import data from "../menu";

interface IProps {
  data: typeof data;
  depth: number;
  activeIds?: number[];
}

export default {
  name: "NestMenu",
  props: ["data", "depth", "activeIds"],
  setup(props: IProps, context) {
    const { depth = 0, activeIds, data } = props;

    /**
     * 这里 activeIds 也可能是异步获取到的 所以用 watch 保证初始化
     */
    const activeId = ref<number | null | undefined>(null);
    watch(
      () => activeIds,
      (newActiveIds) => {
        if (newActiveIds) {
          const newActiveId = newActiveIds[depth];
          if (newActiveId) {
            activeId.value = newActiveId;
          }
        }
      },
      {
        immediate: true,
        flush: 'sync'
      }
    );

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
        // 如果当前层级的 data 中遍历无法找到 `activeId` 的值 说明这个值失效了
        // 把它调整成数据源中第一个子菜单项的 id
        if (!props.data.find(({ id }) => id === activeId.value)) {
          activeId.value = props.data?.[0].id;
        }
      },
      {
        immediate: true,
        // 在观测到数据变动之后 同步执行 这样会防止渲染发生错乱
        flush: "sync",
      }
    );

    const onMenuItemClick = (menuItem) => {
      const newActiveId = menuItem.id;
      if (newActiveId !== activeId.value) {
        activeId.value = newActiveId;
        const child = getActiveSubMenu();
        const subIds = getSubIds(child);
        // 把子菜单的默认第一项 ids 也拼接起来 向父组件 emit
        context.emit("change", [newActiveId, ...subIds]);
      }
    };
    /**
     * 接受到子组件更新 activeId 的同时
     * 需要作为一个中介告知父组件 activeId 更新了
     */
    const onSubActiveIdChange = (ids) => {
      context.emit("change", [activeId.value].concat(ids));
    };
    const getActiveSubMenu = () => {
      return props.data?.find(({ id }) => id === activeId.value)._child;
    };
    const subMenu = computed(getActiveSubMenu);

    /**
     * 样式相关
     */
    const getActiveClass = (id) => {
      if (id === activeId.value) {
        return "menu-active";
      }
      return "";
    };

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

    return {
      depth,
      activeId,
      subMenu,
      onMenuItemClick,
      onSubActiveIdChange,
      getActiveClass,
    };
  },
};
</script>

<style>
.wrap {
  padding: 12px 0;
}

.menu-wrap {
  display: flex;
  flex-wrap: wrap;
}

.menu-wrap-0 {
  background: #ffccc7;
}

.menu-wrap-1 {
  background: #fff7e6;
}

.menu-wrap-2 {
  background: #fcffe6;
}

.menu-item {
  margin-left: 16px;
  cursor: pointer;
  white-space: nowrap;
}

.menu-active {
  color: #f5222d;
}
</style>