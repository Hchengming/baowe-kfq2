import serviceAxios from '@/utils/request.js'
import countryRadioMixins from '../tuobiao/middleware/mixins/countryRadioMixins'
import LogoObj from '../images/logo.json'
// import serviceAxios from '@/utils/request.js'
export default {
  mixins: [countryRadioMixins],
  data() {
    return {
      LogoObj,
      leftMenuWidth: '250px', // 左侧区域宽度
      themeClass: 'charts-theme2', // 项目主题类名
      nowMenuId: '', // 当前menuid
      menuSetting: {
        isShow: false,
        menuId: '',
        jsjbxx: '',
        menuMap: '',
        type: '新增' // 配置类型 新增/修改
      },
      menu_i: 'el-icon-s-fold', // 点击图标控制
      isCollapse: false, // 左侧菜单展示控制`
      defaultActive: '',
      menuData: [], // 菜单数据
      menuActiveIndex: 0, // 顶部菜单选中索引
      // 侧导航数据
      leftMenu: [],
      menuOffon: false,
      themeOffon: false,
      nowProjectConfig: {
        theme: 2,
        jsMethods: ''
      } // 当前查询后主题配置页面数据
    }
  },
  mounted() {
    if (this.settingConfig.theme) {
      this.themeClass = 'charts-theme' + this.settingConfig.theme
    }
    // 登录用户数据处理
    this.userDataInit()
    // 项目常用缓存数据设置
    this.setlocalStorage()
  },
  methods: {
    // 项目常用缓存数据设置
    setlocalStorage() {
      const date = new Date()
      // console.log(date)
      localStorage.setItem('currentDate', date.Format('yyyy-MM-dd'))
      localStorage.setItem('currentMonth', date.Format('MM'))
    },
    // 登录用户数据处理-获取登录用户地区权限
    userDataInit() {
      let user =
        localStorage.getItem('userInfo') || localStorage.getItem('user')
      if (!user) return
      user = JSON.parse(user)

      // user.area = '渝北区'
      // console.log(user)
      localStorage.setItem('country', user.area)
      const area = this.countryRadioValue(user.area)
      localStorage.setItem('area', area)
    },
    // 列表组件新增事件事件传递
    addChartList(param) {
      this.$refs['myPage'].addChartList(param)
    },
    // 列表组件数据获取事件传递
    getData(param) {
      this.$refs['myPage'].getData(param)
    },
    // 项目主体(主题)配置事件
    projectConfigChange(projectConfig) {
      this.themeClass = 'charts-theme' + projectConfig.theme
      this.settingConfig.theme = projectConfig.theme
    },
    // 项目主题获取事件
    getProjectConfig() {
      serviceAxios
        .post(
          this.settingConfig.commonUrl + '/busThemeConfig/selectProjectConfig',
          {
            projectId: this.settingConfig.answerId
          }
        )
        .then(res => {
          if (res.data && res.data.projectConfigs) {
            this.nowProjectConfig = JSON.parse(res.data.projectConfigs)
            this.themeClass = 'charts-theme' + this.nowProjectConfig.theme
            this.settingConfig.theme = this.nowProjectConfig.theme
          }
          this.themeOffon = true
          this.initJsMethodsImplement()
        })
    },
    // 菜单数据获取完成后页面初始化js脚本执行
    initJsMethodsImplement() {
      console.log(this.themeOffon, this.menuOffon)
      if (this.themeOffon && this.menuOffon) {
        this.$nextTick(() => {
          const fnc = this.nowProjectConfig.jsMethods
          if (fnc && fnc.replace(/\s*/g, '')) {
            try {
              // eslint-disable-next-line no-eval
              const test = eval('(false || ' + fnc + ')')
              test({
                menuData: this.menuData
              })
            } catch (e) {
              this.$message({
                type: 'error',
                message: '页面初始化js脚本执行脚本问题：' + e
              })
            }
          }
          if (this.menuData) {
            this.topMenuClick(this.menuData[0], 0)
            console.log(this.leftMenu, 'this.menuData[0]')
          }
        })
      }
    },
    // 项目主题编辑事件
    projectConfigEmit(projectConfig) {
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
            '/busThemeConfig/insertProjectConfigData',
          {
            projectId: this.settingConfig.answerId,
            projectConfig: projectConfig
          }
        )
        .then(() => {
          this.$message({
            type: 'success',
            message: '项目主题修改成功'
          })
          this.getProjectConfig()
        })
    },
    // 项目主体(主题)配置保存事件
    projectConfigSubmit(projectConfig) {
      this.projectConfigEmit(projectConfig)
    },
    // 顶部栏数据变化事件
    changTopAll(viewChange) {
      this.$refs['myPage'].changTopAll(viewChange)
    },
    // 通过模块id改变模块渲染数据事件
    changePageData(moduleId, viewchange, wh) {
      this.$refs['myPage'].changePageData(moduleId, viewchange, wh)
    },
    // 图表模块显示隐藏控制事件
    modeuleShow(obj) {
      this.$refs['myPage'].modeuleShow(obj)
    },
    // 菜单配置按钮点击事件
    menuSettingClick(menuItem) {
      this.menuSetting.menuId = menuItem.menuId
      this.queryMenuSetting(menuItem.menuId)
    },
    // 菜单配置数据查询事件
    queryMenuSetting(menuId, fn) {
      serviceAxios
        .post(
          this.settingConfig.commonUrl +
            '/busMenuSetting/getMenuSettingDataByModuleId',
          {
            menuId
          }
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
    // 菜单配置提交事件
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
    // 工具启动，开始加载数据渲染事件
    startRender() {
      if (this.settingConfig.isBigData) {
        this.$refs['myPage'].setBigData()
      } else {
        // 开始加载菜单数据
        this.getTreeMenu()
        // this.$refs['myPage'].getItemApi()
        // this.$refs['myPage'].getDataIview()
        this.getProjectConfig()
      }
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
    // 菜单点击后js脚本执行
    menuJS(menuId) {
      this.queryMenuSetting(menuId, data => {
        if (data) {
          if (data.jsjbxx && data.jsjbxx.replace(/\s*/g, '') !== '') {
            const funcStr = data.jsjbxx
            // eslint-disable-next-line no-eval
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
      this.defaultActive = menuItem.menuCode
      // this.$refs['myPage'].menuClick(menuItem)
      this.menuClickRedusion(menuItem)
      this.$emit('elementMethods', {
        name: '左侧菜单点击事件',
        methodsName: 'menuClick',
        menuItem
      })
    },
    // 左侧菜单点击样式修改
    leftMenuStyleChange(menuItem) {
      // this.$nextTick(() => {
      //   const submenu = [...document.getElementsByClassName('el-submenu-bw')]
      //   const menuitem = [...document.getElementsByClassName('el-menu-item-bw')]
      //   menuitem.forEach(doc => {
      //     doc.classList.remove('is-active')
      //     if (doc.className.indexOf(menuItem.menuId) > -1) {
      //       doc.classList.add('is-active')
      //     }
      //   })
      //   submenu.forEach(doc => {
      //     const elSubmenutitle = doc.querySelector('.el-submenu__title')
      //     elSubmenutitle.classList.remove('is-active')
      //     if (doc.className.indexOf(menuItem.menuId) > -1) {
      //       elSubmenutitle.classList.add('is-active')
      //     }
      //   })
      // })
    },
    // 顶部菜单点击事件
    topMenuClick(item, index) {
      this.menuJS(item.menuId)
      this.menuActiveIndex = index
      this.leftMenu = item.children
      this.$refs['myPage'].mainStyleChange()
      this.menuClickRedusion(item)
      this.$emit('elementMethods', {
        name: '顶部菜单点击事件',
        methodsName: 'menuClick',
        menuItem: item
      })
    },
    // 顶部栏、左侧有子级菜单点击事件
    menuClickRedusion(item) {
      this.defaultActive = item.menuCode
      this.$refs['myPage'].menuClick(item, 'top', offon => {
        if (this.settingConfig.systemPermissions === 'user') {
          if (offon) {
            if (offon && item.children && item.children.length > 0) {
              this.menuClickRedusion(item.children[0])
            }
          }
        }
      })
      if (this.settingConfig.systemPermissions !== 'user') {
        this.leftMenuStyleChange(item)
      }
    },
    // 顶部栏点击为配置页面跳转
    redusion(item) {
      // if (item.children && item.children.length > 0) {
      //   this.redusion(item.children[0])
      // } else {
      this.menuJump(item.menuCode)
      // }
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
          .post(this.settingConfig.systomMenuApi + '/menu/insertMenu', {
            answerId: this.settingConfig.answerId
          })
          .then(res => {
            // console.log(res)
            const code = res.code
            const resData = res.data
            if (code === 20000) {
              this.$emit('elementMethods', {
                name: '菜单数据获取事件',
                methodsName: 'getMenuData',
                menuData: resData
              })

              this.menuData = resData

              this.menuOffon = true
              this.initJsMethodsImplement()
            }
          })
      } else {
        // 项目-直接菜单数据获取
        // const url = `${window.BaseApi}/applicationcenter/function/findAll?key=a18f4adc-94aa-4aa4-a9cd-e24ec52e2abe&type=1`
        const url = `${window.BaseApi}/applicationcenter/function/findAll?key=${this.settingConfig.answerId}&type=1`
        serviceAxios.get(url, {}).then(res => {
          const code = res.code
          const resData = res.data
          if (code === 20000) {
            this.recursion(resData, 'children', item => {
              item.menuCode = item.apeCode
              item.menuIcon = item.apeCode
              item.menuName = item.apeName
              item.children = item.children ? item.children : []
              item.menuId = item.apeKey
            })

            this.$emit('elementMethods', {
              name: '菜单数据获取事件',
              methodsName: 'getMenuData',
              menuData: resData
            })
            this.menuData = resData
            // if (this.menuData[0]) {
            //   this.$refs['myPage'].menuClick(this.menuData[0])
            //   this.leftMenu = this.menuData[0].children
            // }
            this.menuOffon = true
            console.log(1)
            this.initJsMethodsImplement()
          }
        })
      }
    },

    // 菜单id获取
    getMenuId() {
      const fn = (data, fnc) => {
        data.forEach(item => {
          if (item.children.length > 0) {
            fn(item.children, fnc)
          } else {
            fnc(item)
          }
        })
      }
      const data = []
      fn(this.menuData, item => {
        data.push(item.menuId)
      })
      // console.log(data)
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
      if (this.menuData[this.menuActiveIndex]) {
        this.leftMenu = this.menuData[this.menuActiveIndex].children
      }
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
