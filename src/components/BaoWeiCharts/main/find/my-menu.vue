<template>
  <el-submenu :popper-append-to-body="false"
              v-if="menuItem.children&&menuItem.children.length>0"
              :index="menuItem.menuCode">
    <template slot="title">
      <i :class="['iconfont',menuItem.menuIcon]"></i>
      <span slot="title">{{menuItem.menuName}}</span>
    </template>
    <my-menu v-for="item in menuItem.children"
             :key="item.menuCode"
             :menuItem="item"
             @leftMenuClick="leftMenuClick"></my-menu>
  </el-submenu>
  <el-menu-item v-else
                :index="menuItem.menuCode"
                @click="leftMenuClick(menuItem)">
    <i :class="['iconfont',menuItem.menuIcon]"></i>
    <span slot="title">{{menuItem.menuName}}</span>
  </el-menu-item>
</template>
<script>
export default {
  props: ['menuItem'],
  name: 'myMenu',
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    // 左侧菜单点击事件
    leftMenuClick (menuItem) {
      this.$emit('leftMenuClick', menuItem)
    }
  }
}
</script>
