<template>
  <el-submenu v-if="menuItem.children&&menuItem.children.length>0"
              :popper-append-to-body="false"
              :index="menuItem.menuCode">
    <template slot="title">
      <i v-if="menuItem.menuIcon"
         :class="['iconfont',menuItem.menuIcon]" />
      <span v-if="!menuItem.url"
            slot="title">{{ menuItem.menuName }}</span>
      <a v-if="menuItem.url"
         slot="title"
         :href="menuItem.url"
         target="_blank">{{ menuItem.menuName }}</a>
    </template>
    <my-menu v-for="item in menuItem.children"
             :key="item.menuCode"
             :menu-item="item"
             :settingConfig="settingConfig"
             @menuSettingClick="menuSettingClick"
             @leftMenuClick="leftMenuClick" />
  </el-submenu>
  <el-menu-item v-else
                :index="menuItem.menuCode"
                :class="menuItem.menuCode">
    <span class="txt"
          @click="leftMenuClick(menuItem)">
      <i v-if="menuItem.menuIcon"
         :class="['iconfont',menuItem.menuIcon]" />
      <span v-if="!menuItem.url"
            slot="title">{{ menuItem.menuName }}</span>
    </span>
    <i title="菜单设置"
       v-if="settingConfig.systemPermissions==='admin'"
       class="el-icon-setting"
       @click="menuSettingClick" />
    <a v-if="menuItem.url"
       slot="title"
       :href="menuItem.url"
       target="_blank">{{ menuItem.menuName }}</a>
  </el-menu-item>
</template>
<script>
export default {
  name: 'MyMenu',
  props: {
    menuItem: {
      type: Object,
      default: null
    },
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
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
    },
    //菜单配置按钮点击事件
    menuSettingClick (menuItem) {
      this.$emit('menuSettingClick', menuItem)
    }
  }
}
</script>
