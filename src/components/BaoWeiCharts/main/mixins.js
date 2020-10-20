import serviceAxios from '@/utils/request.js'
// import defaultData from './menuData.json'
export default {
  data() {
    return {
      leftMenuWidth: '200px', // 左侧区域宽度
      menu_i: 'el-icon-s-fold', // 点击图标控制
      isCollapse: false, // 左侧菜单展示控制
      defaultActive: '',
      menuData: [], // 菜单数据
      menuActiveIndex: 0, // 顶部菜单选中索引
      // 侧导航数据
      leftMenu: []
    }
  },
  methods: {
    //工具启动，开始加载数据渲染事件
    startRender() {
      //开始加载菜单数据
      this.getTreeMenu()
      this.$refs['myPage'].getItemApi()
    },
    //表格、列表单元格点击菜单跳转事件执行
    cellClickMenuTap(obj) {
      if (obj.methodsName === 'cellClick') {
        let contentAreaConfig = obj.statisticsAll.contentAreaConfig
        if (
          contentAreaConfig.menuTapAll.isMenuTap === '1' &&
          contentAreaConfig.menuTapAll.menuTapKey === obj.key
        ) {
          let nowMenuCode = ''
          contentAreaConfig.keyArr.forEach(item => {
            if (item.key === contentAreaConfig.menuTapAll.menuCodeKey) {
              nowMenuCode = obj.rowItem[item.key]
            }
          })
          this.menuJump(nowMenuCode)
        }
      }
    },
    // 组件事件暴露
    elementMethods(obj) {
      this.cellClickMenuTap(obj)
      this.$emit('elementMethods', obj)
    },
    // 左侧菜单点击事件
    leftMenuClick(menuItem) {
      this.$refs['myPage'].menuClick(menuItem)
      this.$emit('elementMethods', {
        name: '左侧菜单点击事件',
        methodsName: 'menuClick',
        menuItem
      })
    },
    // 顶部菜单点击事件
    topMenuClick(item, index) {
      this.menuActiveIndex = index
      this.leftMenu = item.children
      this.$refs['myPage'].mainStyleChange()
      this.$refs['myPage'].menuClick(item, 'top', offon => {
        // console.log(offon, 'offon')
        if (offon && item.children && item.children.length > 0) {
          this.menuJump(item.children[0].menuCode)
        }
      })
      this.$emit('elementMethods', {
        name: '顶部菜单点击事件',
        methodsName: 'menuClick',
        menuItem: item
      })
    },
    // 菜单树数据查询事件
    getTreeMenu() {
      // this.menuData = defaultData
      // if (this.menuData[0]) {
      //   this.$refs['myPage'].menuClick(this.menuData[0])
      //   return false
      // }
      if (this.settingConfig.isCustomMenu) {
        //自定义配置菜单数据获取
        serviceAxios
          .post(this.settingConfig.systomMenuApi + '/menu/insertMenu')
          .then(res => {
            // console.log(res)
            let code = res.code
            let resData = res.data
            if (code === 20000) {
              this.menuData = resData
              if (this.menuData[0]) {
                this.$refs['myPage'].menuClick(this.menuData[0])
                this.leftMenu = this.menuData[0].children
              }
            }
          })
      } else {
        //规划局项目-直接菜单数据获取
        serviceAxios.get(this.settingConfig.getMenuUrl, {}).then(res => {
          let code = res.code
          let resData = res.data
          if (code === 20000) {
            this.recursion(resData, 'children', item => {
              item.menuCode = item.apeCode
              item.menuName = item.apeName
              item.children = item.children ? item.children : []
              item.menuId = item.apeKey
            })
            this.menuData = resData
            if (this.menuData[0]) {
              this.$refs['myPage'].menuClick(this.menuData[0])
              this.leftMenu = this.menuData[0].children
            }
          }
        })
      }
    },
    //最外层--通过menuCode触发菜单跳转事件
    menuJump(menuCode) {
      this.menuData.forEach((items, index) => {
        if (items.menuCode === menuCode) {
          this.menuActiveIndex = index
          this.leftMenu = items.children
          this.$refs['myPage'].menuClick(items)
          return false
        }
        if (items.children.length > 0) {
          this.recursion(items.children, 'children', item => {
            if (item.menuCode === menuCode) {
              this.menuActiveIndex = index
              this.leftMenu = items.children
              this.$refs['myPage'].menuClick(item)
              this.defaultActive = menuCode
            }
          })
        }
      })
    },
    // 菜单数据变化更新
    getMenuChange(menuData) {
      this.menuData = menuData
      this.leftMenu = this.menuData[this.menuActiveIndex].children
    },
    // 左侧菜单展示控制
    leftMenuControl() {
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
