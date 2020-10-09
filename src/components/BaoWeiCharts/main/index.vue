<template>
  <div id="bao-wei-charts">
    <el-container class="KFQ_wrap">
      <el-header >
        <div class="logo">
          <img :src="settingConfig.logoUrl" />
          <span>{{settingConfig.itemTitle}}</span>
          <i @click="leftMenuControl"
             v-if="leftMenu.length > 0"
             :class="['menu_icon theme-color', menu_i]"></i>
        </div>
        <ul class="header_menu">
          <li v-for="(item, index) in menuData"
              @click="topMenuClick(item, index)"
              :class="{
            'active': menuActiveIndex == index
          }"
              :key="index">
            <i :class="['iconfont', item.menuIcon, 'theme-color']"></i>
            {{ item.menuName }}
          </li>
        </ul>
      </el-header>
      <el-container>
        <!-- 左侧导航栏 -->
        <el-aside :width="leftMenuWidth"
                  v-if="leftMenu.length > 0">
          <el-menu :default-active="defaultActive"
                   class="el-menu-vertical-demo menu-bg-color"
                   :collapse="isCollapse">
            <my-menu v-for="menuItem in leftMenu"
                     :key="menuItem.menuCode"
                     :menuItem="menuItem"
                     @leftMenuClick="leftMenuClick"></my-menu>
          </el-menu>
        </el-aside>
        <!-- 内容区域 -->
        <el-main class="theme-bg">
          <my-page ref="myPage"
                   @getMenuData="getMenuChange"
                   @elementMethods="elementMethods"
                   :settingConfig="settingConfig"></my-page>
          <slot name="content"></slot>
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
import JSMixins from './mixins.js'
export default {
  name: 'wrap',
  mixins: [commonMethods,JSMixins],
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  components: { MyMenu, MyPage }

}


</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
