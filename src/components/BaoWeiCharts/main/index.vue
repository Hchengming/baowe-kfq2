<template>
  <el-container class="KFQ_wrap">
    <el-header>
      <div class="logo">
        <span>重庆市开发区用地审核与监管系统</span>
        <i @click="leftMenuControl"
           v-if="leftMenu.length > 0"
           :class="['menu_icon theme-color', menu_i]"></i>
      </div>
      <ul class="header_menu">
        <li v-for="(item, index) in menuData"
            @click="topMenuClick(item, index)"
            :class="{
            'theme-color theme-border-color active': menuActiveIndex == index
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
        <el-menu default-active
                 class="el-menu-vertical-demo"
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
                 :settingConfig="settingConfig"></my-page>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import MyMenu from './find/my-menu'
import MyPage from './find/myPage'
// import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import defaultData from './menuData.json'
export default {
  name: 'wrap',
  props: {
    settingConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  components: { MyMenu, MyPage },
  data () {
    return {
      leftMenuWidth: '200px', // 左侧区域宽度
      menu_i: 'el-icon-s-fold', // 点击图标控制
      isCollapse: false, // 左侧菜单展示控制
      menuData: [], // 菜单数据
      menuActiveIndex: 0, // 顶部菜单选中索引
      // 侧导航数据
      leftMenu: []
    }
  },
  mounted () {
    this.getTreeMenu()
  },
  methods: {
    // 左侧菜单点击事件
    leftMenuClick (menuItem) {
      this.$refs['myPage'].menuClick(menuItem)
    },
    // 顶部菜单点击事件
    topMenuClick (item, index) {
      this.menuActiveIndex = index
      this.leftMenu = item.children
      this.$refs['myPage'].mainStyleChange()
      this.$refs['myPage'].menuClick(item)
    },
    // 菜单树数据查询事件
    getTreeMenu: function () {
      this.menuData = defaultData
      // axios
      // .post(this.settingConfig.commonUrl + '/menu/insertMenu')
      // .then(res => {
      //   let status = res.data.status
      //   let reqData = res.data.data
      //   if (status === 0) {
      //     this.menuData = reqData
      //     if (this.menuData[0]) {
      //       this.$refs['myPage'].menuClick(this.menuData[0])
      //     }
      //   }
      // })
    },
    // 菜单数据变化更新
    getMenuChange (menuData) {
      this.menuData = menuData
      this.leftMenu = this.menuData[this.menuActiveIndex].children
    },
    // 左侧菜单展示控制
    leftMenuControl () {
      this.menu_i =
        this.menu_i === 'el-icon-s-fold' ? 'el-icon-s-unfold' : 'el-icon-s-fold'
      this.isCollapse = !this.isCollapse
      setTimeout(() => {
        this.leftMenuWidth = this.isCollapse ? '64px' : '200px'
        this.$refs['myPage'].mainStyleChange()
      }, 100)
    }
  }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
