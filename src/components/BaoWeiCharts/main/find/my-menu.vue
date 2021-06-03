<template>
  <el-submenu
    v-if="menuItem.children && menuItem.children.length > 0"
    :popper-append-to-body="false"
    :index="menuItem.menuCode"
    :class="[menuItem.menuCode,menuItem.menuId,'el-submenu-bw']"

  >
    <template slot="title">
      <span style="display:block" @click="leftMenuClick(menuItem)">
        <i :class="['iconfont', menuItem.menuIcon]" />
        <span v-if="!menuItem.url" slot="title">{{ menuItem.menuName }}</span>
        <a
          v-if="menuItem.url"
          slot="title"
          :href="menuItem.url"
          target="_blank"
        >{{ menuItem.menuName }}</a
        >
      </span>
    </template>
    <my-menu
      v-for="item in menuItem.children"
      :key="item.menuCode"
      :menu-item="item"
      :setting-config="settingConfig"
      @menuSettingClick="menuSettingClick"
      @leftMenuClick="leftMenuClick"
    />
  </el-submenu>
  <el-menu-item v-else :index="menuItem.menuCode" :class="[menuItem.menuCode,menuItem.menuId,'el-menu-item-bw']">
    <span class="txt" @click="leftMenuClick(menuItem)">
      <i :class="['iconfont', menuItem.menuIcon]" />
      <span v-if="!menuItem.url" slot="title">{{ menuItem.menuName }}</span>
    </span>
    <i
      v-if="settingConfig.systemPermissions === 'admin'"
      title="菜单设置"
      class="el-icon-setting"
      @click="menuSettingClick"
    />
    <a v-if="menuItem.url" slot="title" :href="menuItem.url" target="_blank">{{
      menuItem.menuName
    }}</a>
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
  data() {
    return {
      nowMenuCode: ''
    }
  },
  mounted() {},
  methods: {
    // 左侧菜单点击事件
    leftMenuClick(menuItem) {
      this.nowMenuCode = menuItem.menuCode
      this.$emit('leftMenuClick', menuItem)
      // sessionStorage.setItem("leftMenuCode",menuItem.menuCode)
    },
    // 菜单配置按钮点击事件
    menuSettingClick(menuItem) {
      this.$emit('menuSettingClick', menuItem)
    }
  }
}
</script>
