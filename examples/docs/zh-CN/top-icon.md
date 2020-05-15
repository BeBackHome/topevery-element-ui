## topevery-icon 图标库

### 使用方法

直接通过设置类名为 `el-icon-iconName` 来使用即可。例如：

:::demo
```html
<i class="el-icon-edit"></i>
<i class="el-icon-share"></i>
<i class="el-icon-delete"></i>
<el-button type="primary" icon="el-icon-search">搜索</el-button>

```
:::

### 图标集合

<ul class="icon-list">
  <li v-for="name in $topicon" :key="name.icon_id">
    <span>
      <i :class="'iconfont icon' + name.font_class" />
      <span class="icon-name">{{name.name}}</span>
    </span>
  </li>
</ul>