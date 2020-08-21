## 前言

小伙伴们好久不见，最近刚入职新公司，需求排的很满，平常是实在没时间写文章了，更新频率会变得比较慢。

周末在家闲着无聊，突然小弟过来紧急求助，说是有个 Vue 的很复杂的递归菜单实在是设计不出来。

我看了一下需求，确实是比较复杂，需要利用好递归组件，正好趁着这个机会总结一篇递归组件配合 Vue3 和 TS 的文章，其实我自己也是第一次设计递归组件。

## 需求

需求是这样的，后端会返回一串可能有无限层级的菜单，格式如下：

```js
[
  {
    id: 1,
    father_id: 0,
    status: 1,
    name: "生命科学竞赛",
    _child: [
      {
        id: 2,
        father_id: 1,
        status: 1,
        name: "野外实习类",
        _child: [{ id: 3, father_id: 2, status: 1, name: "植物学" }],
      },
      {
        id: 7,
        father_id: 1,
        status: 1,
        name: "科学研究类",
        _child: [
          { id: 8, father_id: 7, status: 1, name: "植物学与植物生理学" },
          { id: 9, father_id: 7, status: 1, name: "动物学与动物生理学" },
          { id: 10, father_id: 7, status: 1, name: "微生物学" },
          { id: 11, father_id: 7, status: 1, name: "生态学" },
        ],
      },
      { id: 71, father_id: 1, status: 1, name: "添加" },
    ],
  },
  {
    id: 56,
    father_id: 0,
    status: 1,
    name: "考研相关",
    _child: [
      { id: 57, father_id: 56, status: 1, name: "政治" },
      { id: 58, father_id: 56, status: 1, name: "外国语" },
    ],
  },
];
```

每一层的菜单元素如果有 `_child` 属性，点击以后就要继续展示这一项的所有子菜单，样式大概是这样的：

![image](https://user-images.githubusercontent.com/23615778/90865218-9fa97700-e3c4-11ea-9e5b-37686c269019.png)

点击了中间的 `科学研究类`，子菜单就变成了这个样子：

![image](https://user-images.githubusercontent.com/23615778/90865684-57d71f80-e3c5-11ea-9d7f-6f0ff7689aa3.png)

并且点击其中的任意一个层级，都需要把菜单的 **完整的 `id` 链路** 传递到最外层，给父组件请求数据用。

比如点击了 `科学研究类`，那么向外 `emit` 的时候还需要带上默认选中的它的第一个子菜单 `植物学与植物生理学` 的 `id`。

## 实现

这很显然是一个递归组件的需求，在设计递归组件的时候，我们要先想清楚数据到视图的映射。

在后端返回的数据中，数组的每一层可以分别对应一个菜单项，那么数组的层则就对应视图中的一行，数组每一层的 `child` 就会被作为子数据，交给递归的 `NestMenu` 组件，直到某一层的数据不再有 `child`，则递归终止。

由于需求要求每一层的样式可能是不同的，所以再每次调用递归组件的时候，我们都需要从父组件中拿到一个 `depth` 代表层级，并且把这个 `depth + 1`。

重点主要就是这些，接下来编码实现。

先看 `template` 部分的大致结构：

```xml
<template>
  <div class="wrap">
    <div class="menu-wrap">
      <div
        class="menu-item"
        v-for="menuItem in data"
      >{{menuItem.name}}</div>
    </div>
    <nest-menu
      :key="activeId"
      v-if="activeId !== null"
      :data="getActiveSubMenu()"
      :depth="depth + 1"
    ></nest-menu>
  </div>
</template>
```

和我们预想设计中的一样， `menu-wrap` 代表当前菜单层， `nest-menu` 则就是组件本身，它负责递归的渲染子组件。

### 首次渲染

在第一次获取到整个菜单的数据的时候，我们需要先把每层菜单的选中项默认设置为第一个子菜单，由于它很可能是异步获取的，所以我们最好是 `watch` 这个数据来做这个操作。

```js
// 菜单数据源发生变化的时候 默认选中当前层级的第一项
const activeId = (ref < number) | (null > null);

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
```

现在我们从最上层开始讲起，第一层的 `activeId` 被设置成了 `生命科学竞赛` 的 id，注意我们传递给递归组件的 `data` 是通过 `getActiveSubMenu` 这个方法实现的：

```js
const getActiveSubMenu = () => {
  return data.find(({ id }) => id === activeId.value)._child;
};
```

这样，就拿到了 `生命科学竞赛` 的 `child`，作为子组件的数据传递下去了。

### 点击菜单项

点击菜单项以后，其实简单的把 `activeId` 设置好，剩下的交给 `watch` 去做。

```js
const onMenuItemClick = (menuItem) => {
  activeId.value = menuItem.id;
};
```

回到之前的需求设计，在点击了菜单项后，无论点击的是哪层，都需要把完整的 `id` 链路通过 `emit` 传递到最外层去，所以这里我们需要多做一些处理：

```js
watch(
  () => activeId.value,
  (newId) => {
    // 这里需要递归找到这层菜单以下的子菜单的 activeId 拼接在后面
    // 直接默认找第一个即可
    const child = getActiveSubMenu();
    const subIds = [];
    const traverse = (data) => {
      if (data && data.length) {
        const first = data[0];
        subIds.push(first.id);
        traverse(first._child);
      }
    };
    traverse(child);
    // 把子菜单的 ids 也拼接起来 向父组件 emit
    context.emit("change", [newId, ...subIds]);
  }
);
```

由于我们之前定的规则是，点击了新的菜单以后默认选中子菜单的第一项，所以这里我们也递归去找数据里的第一项，放到 `subIds` 中，直到最底层即可。

注意这里的 `context.emit("change", [newId, ...subIds]);`，这里是把事件向上 `emit`，如果这个菜单是中间层级的菜单，那么它的父组件也是 `NestMenu`，我们需要在递归调用 `NestMenu` 组件的时候监听这个事件。

```xml
<nest-menu
    :key="activeId"
    v-if="activeId !== null"
    :data="getActiveSubMenu()"
    :depth="depth + 1"
    @change="onSubActiveIdChange"
></nest-menu>
```

在父层级的菜单接受到了子层级的菜单的 `change` 事件后，需要怎么做呢？没错，需要进一步的再向上传递：

```js
const onSubActiveIdChange = (ids) => {
  context.emit("change", [activeId.value].concat(ids));
};
```

这里就只需要简单的把自己当前的 `activeId` 拼接到数组的最前面，再继续向上传递即可。

这样，任意一层的组件点击了菜单后，都会先用自己的 `activeId` 拼接好所有子层级的默认 `activeId`，再一层层向上 `emit`。并且向上的每一层父菜单都会把自己的 `activeId` 拼在前面，就像接力一样。

最后，我们在应用层级的组件里，就可以轻松的拿到完整的 `id` 链路：

```xml
<template>
  <nest-menu :data="menu" @change="activeIdsChange" />
</template>
```

### 样式区分

由于我们每次调用递归组件的时候，都会把 `depth + 1`，那么就可以通过把这个数字拼接到类名后面来实现样式区分了。

```xml
<template>
  <div class="wrap">
    <div class="menu-wrap" :class="`menu-wrap-${depth}`">
      <div class="menu-item">{{menuItem.name}}</div>
    </div>
    <nest-menu />
  </div>
</template>

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
</style>
```

## 完整代码

```js
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
      v-if="activeId !== null"
      :data="getActiveSubMenu()"
      :depth="depth + 1"
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
}

export default {
  name: "NestMenu",
  props: ["data", "depth"],
  setup(props: IProps, context) {
    const { depth = 0 } = props;

    const activeId = ref<number | null>(null);

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
      return data.find(({ id }) => id === activeId.value)._child;
    };
    const getActiveClass = (id) => {
      if (id === activeId.value) {
        return "menu-active";
      }
      return "";
    };

    // 菜单数据源发生变化的时候 默认选中当前层级的第一项
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

    watch(
      () => activeId.value,
      (newId) => {
        // 这里需要递归找到这层菜单以下的子菜单的 activeId 拼接在后面
        // 直接默认找第一个即可
        const child = getActiveSubMenu();
        const subIds = [];
        const traverse = (data) => {
          if (data && data.length) {
            const first = data[0];
            subIds.push(first.id);
            traverse(first._child);
          }
        };
        traverse(child);
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
```
