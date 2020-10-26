<template>
  <div id="bao-wei-charts"
       :class="themeClass()">
    <el-container class="KFQ_wrap">
      <el-header class="theme-bg-color">
        <div class="logo">
          <img :src="settingConfig.logoUrl">
          <span>{{ settingConfig.itemTitle }}</span>
          <i v-if="leftMenu.length > 0"
             :class="['menu_icon theme-color', menu_i]"
             @click="leftMenuControl" />
        </div>
        <ul class="header_menu">
          <li v-for="(item, index) in menuData"
              :key="index"
              :class="{
              'active': menuActiveIndex == index
            }"
              @click="topMenuClick(item, index)">
            <i :class="['iconfont', item.menuIcon, 'theme-color']" />
            {{ item.menuName }}
          </li>
        </ul>
      </el-header>
      <el-container>
        <!-- 左侧导航栏 -->
        <el-aside v-if="leftMenu.length > 0"
                  :width="leftMenuWidth">
          <el-menu :default-active="defaultActive"
                   class="el-menu-vertical-demo menu-bg-color"
                   :collapse="isCollapse">
            <my-menu v-for="menuItem in leftMenu"
                     :key="menuItem.menuCode"
                     :menu-item="menuItem"
                     @leftMenuClick="leftMenuClick" />
          </el-menu>
        </el-aside>
        <!-- 内容区域 -->
        <el-main class="theme-bg">
          <my-page ref="myPage"
                   :setting-config="settingConfig"
                   @getMenuData="getMenuChange"
                   @elementMethods="elementMethods" />
          <slot name="content" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import '../css/font/iconfont.css'
import '../css/index.css'
import MyMenu from './find/my-menu'
import MyPage from './find/myPage'
// eslint-disable-next-line no-unused-vars
import defaultData from './menuData.json'

import { commonMethods } from '../utils/mixins.js'
import JSMixins from './mainMixins.js'
export default {
  name: 'Wrap',
  components: { MyMenu, MyPage },
  mixins: [commonMethods, JSMixins],
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  }

}

</script>

<style lang="scss">
@import "../css/theme/theme1.scss";
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
