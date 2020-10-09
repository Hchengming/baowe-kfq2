<template>
  <el-submenu :popper-append-to-body="false"
              v-if="menuItem.children&&menuItem.children.length>0"
              :index="menuItem.menuCode">
    <template slot="title">
      <i v-if="menuItem.menuIcon"
         :class="['iconfont',menuItem.menuIcon]"></i>
      <span v-if="!menuItem.url"
            slot="title">{{menuItem.menuName}}</span>
      <a v-if="menuItem.url"
         :href="menuItem.url"
         target="_blank"
         slot="title">{{menuItem.menuName}}</a>
    </template>
    <my-menu v-for="item in menuItem.children"
             :key="item.menuCode"
             :menuItem="item"
             @leftMenuClick="leftMenuClick"></my-menu>
  </el-submenu>
  <el-menu-item v-else
                :index="menuItem.menuCode"
                :class="menuItem.menuCode"
                @click="leftMenuClick(menuItem)">
    <i v-if="menuItem.menuIcon"
       :class="['iconfont',menuItem.menuIcon]"></i>
    <span v-if="!menuItem.url"
          slot="title">{{menuItem.menuName}}</span>
    <a v-if="menuItem.url"
       :href="menuItem.url"
       target="_blank"
       slot="title">{{menuItem.menuName}}</a>
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
      // sessionStorage.setItem("leftMenuCode",menuItem.menuCode)
    }
  }
}
</script>
