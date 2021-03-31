<template>
  <div id="bao-wei-charts" :class="themeClass">

    <el-container :class="['KFQ_wrap',{'isBigData':settingConfig.isBigData}]">
      <el-header v-if="!settingConfig.isBigData" class="theme-bg-color">
        <div class="logo">
          <img :src="settingConfig.logoUrl">
          <span>{{ settingConfig.itemTitle }}</span>
          <i
            v-if="leftMenu.length > 0"
            :class="['menu_icon theme-color', menu_i]"
            @click="leftMenuControl"
          />
        </div>
        <ul class="header_menu">
          <li
            v-for="(item, index) in menuData"
            :key="index"
            :class="{
              active: menuActiveIndex == index
            }"
          >
            <span @click="topMenuClick(item, index)">
              <i :class="['iconfont', item.menuIcon, 'theme-color']" />{{
                item.menuName
              }}
            </span>
            <i
              v-if="settingConfig.systemPermissions === 'admin'"
              title="菜单设置"
              class="el-icon-setting"
              @click="menuSettingClick(item)"
            />
          </li>
        </ul>
      </el-header>
      <el-container>
        <!-- 左侧导航栏 -->
        <el-aside v-if="leftMenu.length > 0" :width="leftMenuWidth">
          <el-menu
            :default-active="defaultActive"
            :collapse="isCollapse"
            class="el-menu-vertical-demo menu-bg-color"
          >
            <my-menu
              v-for="menuItem in leftMenu"
              :key="menuItem.menuCode"
              :menu-item="menuItem"
              :setting-config="settingConfig"
              @menuSettingClick="menuSettingClick"
              @leftMenuClick="leftMenuClick"
            />
          </el-menu>
        </el-aside>
        <!-- 内容区域 -->
        <el-main class="theme-bg">
          <my-page
            ref="myPage"
            :setting-config="settingConfig"
            :now-project-config="nowProjectConfig"
            :slot-name="slotName"
            @projectConfigChange="projectConfigChange"
            @projectConfigSubmit="projectConfigSubmit"
            @getMenuData="getMenuChange"
            @elementMethods="elementMethods"
          >
            <div
              v-for="item in slotName"
              :key="item"
              :slot="item"
              style="width:100%;height:100%"
            >
              <slot :name="item" />
            </div>
          </my-page>
          <slot name="content" />
        </el-main>
      </el-container>
    </el-container>
    <menu-setting :menu-setting="menuSetting" @submit="menuSettingSubmit" />
  </div>
</template>
<script>
import '../css/font/iconfont.css'
import '../css/index.css'
import MyMenu from './find/my-menu'
import MyPage from './find/myPage'
// eslint-disable-next-line no-unused-vars
import defaultData from './menuData.json'
import menuSetting from './find/menuSetting'
import { commonMethods } from '../utils/mixins.js'
import JSMixins from './mainMixins.js'
export default {
  name: 'Wrap',
  components: { MyMenu, MyPage, menuSetting },
  mixins: [commonMethods, JSMixins],
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    slotName: {
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="scss">
@import '../css/theme/theme0.scss';
@import '../css/theme/theme1.scss';
@import '../css/theme/theme2.scss';
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  min-height: 400px;
}
</style>
