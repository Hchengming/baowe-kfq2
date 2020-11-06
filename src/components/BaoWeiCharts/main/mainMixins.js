import serviceAxios from '@/utils/request.js'
// import defaultData from './menuData.json'
export default {
  data() {
    return {
      leftMenuWidth: '200px', // 左侧区域宽度
      nowMenuId: '', //当前menuid
      menuSetting: {
        isShow: false,
        menuId: '',
        jsjbxx: '',
        menuMap: '',
        type: '新增' //配置类型 新增/修改
      },
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
    //菜单配置按钮点击事件
    menuSettingClick(menuItem) {
      this.menuSetting.menuId = menuItem.menuId
      this.queryMenuSetting(menuItem.menuId)
    },
    //菜单配置数据查询事件
    queryMenuSetting(menuId, fn) {
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
            '/busMenuSetting/getMenuSettingDataByModuleId',
          { menuId }
        )
        .then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            if (fn) {
              fn(resData)
            } else {
              if (resData) {
                this.menuSetting.jsjbxx = resData.jsjbxx
                this.menuSetting.type = '修改'
              } else {
                this.menuSetting.type = '新增'
                this.menuSetting.jsjbxx = ''
              }
              this.menuSetting.isShow = true
            }
          }
        })
    },
    //菜单配置提交事件
    menuSettingSubmit() {
      let url = ''
      if (this.menuSetting.type === '新增') {
        url = '/busMenuSetting/insertMenuSettingData'
      } else {
        url = '/busMenuSetting/updateMenuSettingData'
      }
      const reqData = {
        menuId: this.menuSetting.menuId,
        jsjbxx: this.menuSetting.jsjbxx,
        menuMap: {}
      }
      serviceAxios
        .post(this.settingConfig.commonUrl + url, reqData)
        .then(res => {
          const code = res.code
          // const resData = res.data
          if (code === 20000) {
            this.$message({
              message: '菜单配置' + this.menuSetting.type + '成功',
              type: 'success'
            })
            this.menuSetting.isShow = false
          }
        })
    },
    //组题选则类名
    themeClass() {
      let themeClass = ''
      switch (this.settingConfig.theme) {
        case '1':
          themeClass = 'charts-theme1'
          break
        default:
          themeClass = ''
      }
      return themeClass
    },
    // 工具启动，开始加载数据渲染事件
    startRender() {
      // 开始加载菜单数据
      this.getTreeMenu()
      this.$refs['myPage'].getItemApi()
      this.$refs['myPage'].getDataIview()
    },
    // 表格、列表单元格点击菜单跳转事件执行
    cellClickMenuTap(obj) {
      if (obj.methodsName === 'cellClick') {
        const contentAreaConfig = obj.statisticsAll.contentAreaConfig
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
    //菜单点击后js脚本执行
    menuJS(menuId) {
      this.queryMenuSetting(menuId, data => {
        if (data) {
          if (data.jsjbxx && data.jsjbxx.replace(/\s*/g, '') !== '') {
            const funcStr = data.jsjbxx
            const test = eval('(false || ' + funcStr + ')')
            if (test) {
              test()
            }
          }
        }
      })
    },
    // 左侧菜单点击事件
    leftMenuClick(menuItem) {
      this.menuJS(menuItem.menuId)

      this.$refs['myPage'].menuClick(menuItem)
      this.$emit('elementMethods', {
        name: '左侧菜单点击事件',
        methodsName: 'menuClick',
        menuItem
      })
    },
    // 顶部菜单点击事件
    topMenuClick(item, index) {
      this.menuJS(item.menuId)
      this.menuActiveIndex = index
      this.leftMenu = item.children
      this.$refs['myPage'].mainStyleChange()
      this.$refs['myPage'].menuClick(item, 'top', offon => {
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
        // 自定义配置菜单数据获取
        serviceAxios
          .post(this.settingConfig.systomMenuApi + '/menu/insertMenu')
          .then(res => {
            // console.log(res)
            const code = res.code
            const resData = res.data
            if (code === 20000) {
              this.menuData = resData
              if (this.menuData[0]) {
                this.$refs['myPage'].menuClick(this.menuData[0])
                this.leftMenu = this.menuData[0].children
              }
              this.$emit('elementMethods', {
                name: '菜单数据获取事件',
                methodsName: 'getMenuData',
                menuData: this.menuData
              })
            }
          })
      } else {
        // 规划局项目-直接菜单数据获取
        serviceAxios.get(this.settingConfig.getMenuUrl, {}).then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            this.recursion(resData, 'children', item => {
              item.menuCode = item.apeCode
              item.menuName = item.apeName
              item.children = item.children ? item.children : []
              item.menuId = item.apeKey
            })
            this.menuData = resData
            this.$emit('elementMethods', {
              name: '菜单数据获取事件',
              methodsName: 'getMenuData',
              menuData: this.menuData
            })
            if (this.menuData[0]) {
              this.$refs['myPage'].menuClick(this.menuData[0])
              this.leftMenu = this.menuData[0].children
            }
          }
        })
      }
    },
    // 最外层--通过menuCode触发菜单跳转事件
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
