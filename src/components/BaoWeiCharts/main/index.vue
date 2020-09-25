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
          <el-menu :default-active="defaultActive()"
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
import serviceAxios from '@/utils/request.js'
import { commonMethods } from '../utils/mixins.js'
export default {
  name: 'wrap',
  mixins: [commonMethods],
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
    defaultActive () {
      return ''
    },
    // 组件事件暴露
    elementMethods (obj) {
      this.$emit('elementMethods', obj)
    },
    // 左侧菜单点击事件
    leftMenuClick (menuItem) {
      this.$refs['myPage'].menuClick(menuItem)
      this.$emit('elementMethods', {
        name: '左侧菜单点击事件',
        methodsName: "menuClick",
        menuItem
      })
    },
    // 顶部菜单点击事件
    topMenuClick (item, index) {
      this.menuActiveIndex = index
      this.leftMenu = item.children
      this.$refs['myPage'].mainStyleChange()
      this.$refs['myPage'].menuClick(item)
      this.$emit('elementMethods', {
        name: '顶部菜单点击事件',
        methodsName: "menuClick",
        menuItem: item
      })
    },
    // 菜单树数据查询事件
    getTreeMenu: function () {
      this.menuData = defaultData
      if (this.menuData[0]) {
            this.$refs['myPage'].menuClick(this.menuData[0])
          return false
      }
      serviceAxios
      .get(this.settingConfig.getMenuUrl,{})
      .then(res => {
        let code = res.code
        let resData = res.data
        if (code === 20000) {
          this.recursion(resData,'children',(item)=>{
            item.menuCode=item.apeCode
            item.menuName=item.apeName
            item.children=item.children?item.children:[]
            item.menuId=item.apeKey
          })
          this.menuData=resData
          if (this.menuData[0]) {
            this.$refs['myPage'].menuClick(this.menuData[0])
             this.leftMenu = this.menuData[0].children
          }
        }
      })
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

// {
//     "menuName": "一张图查询",//菜单名
//     "menuCode": "100",//菜单编码
//     "menuIcon": "",//菜单图标
//     "menuId": "9d984bd0cbbe11eaa14021da1718822c",//菜单id
//     "url":"",//新页面打开路径
//     "children": []
//   },
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
