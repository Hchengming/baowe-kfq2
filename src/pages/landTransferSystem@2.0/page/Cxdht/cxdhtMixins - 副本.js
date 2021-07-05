export default {
  data() {
    return {
      nf: window.config.DefaultYear,
      radioData: ['宗地数', '面积/金额'],
      whereAll: {
        type: '宗地数'
      },
      projectTotal: '——',
      listData: [
        {
          title: '规划条件',
          top: [
            {
              // 0
              label: '已核发',
              labelKey: '已核发',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '正在办理',
              labelKey: '正在办理',
              value: '——'
            }
          ]
        },
        {
          title: '土地出让会审',
          top: [
            {
              // 1
              label: '已会审',
              labelKey: '已会审',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '正在办理',
              labelKey: '正在办理',
              value: '——'
            }
          ]
        },
        {
          title: '出让公告',
          top: [
            {
              // 2
              label: '已公告',
              labelKey: '已公告',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '未公示',
              labelKey: '未公示',
              value: '——'
            }
          ]
        },
        {
          title: '签订合同',
          top: [
            {
              // 3
              label: '已签订',
              labelKey: '已签订',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '正在办理',
              labelKey: '正在办理',
              value: '——'
            },
            {
              label: '未按时缴款',
              labelKey: '未按时缴纳',
              value: '——'
            }
          ]
        },
        {
          title: '交地',
          top: [
            {
              // 4
              label: '已交地',
              labelKey: '已交地',
              value: '——'
            },
            {
              label: '其中未按时交地',
              labelKey: '已交地未按时交地',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '未交地',
              labelKey: '未交地',
              value: '——'
            },
            {
              label: '其中未按时交地',
              labelKey: '未交地未按时交地',
              value: '——'
            }
          ]
        },
        {
          title: '公示牌',
          top: [
            {
              // 5
              label: '已公示',
              labelKey: '已公示',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '未公示',
              labelKey: '未公示',
              value: '——'
            }
          ]
        },
        {
          title: '用地规划许可',
          top: [
            {
              // 6
              label: '已核发',
              labelKey: '用地规划许可已核发',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '正在办理',
              labelKey: '正在办理',
              value: '——'
            }
          ]
        },
        {
          title: '工程规划许可',
          top: [
            {
              // 7
              label: '已核发',
              labelKey: '工程规划许可已核发',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '正在办理',
              labelKey: '正在办理',
              value: '——'
            }
          ]
        },
        // {
        //     bottom3: [{
        //         label: "停工数",
        //         value: 31,
        //     }],

        // },
        {
          title: '开工',
          top: [
            {
              // 8
              label: '已开工',
              labelKey: '已开工',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '开工提醒',
              labelKey: '开工提醒',
              value: '——'
            },
            {
              label: '未按时开工',
              labelKey: '未按时开工',
              value: '——'
            }
          ],
          leaveUnused: {
            xzList: {
              label: '闲置待认定',
              labelKey: '闲置待认定',
              value: '——'
            },
            xzyqdList: {
              label: '闲置已确定',
              labelKey: '闲置已确定',
              value: '——'
            },
            qyyyList: [
              {
                label: '企业原因',
                labelKey: '企业原因闲置',
                value: '——'
              },
              {
                label: '已处置',
                labelKey: '已处置',
                value: '——'
              }
            ],
            zfyyList: [
              {
                label: '政府原因',
                labelKey: '政府原因闲置',
                value: '——'
              },
              {
                label: '已处置',
                labelKey: '已处置',
                value: '——'
              }
            ]
          }
        },
        {
          title: '竣工规划核实',
          top: [
            {
              // 9
              label: '已核发',
              labelKey: '竣工核实已核发',
              value: '——'
            }
          ],
          bottom: [
            {
              label: '正在办理',
              labelKey: '正在办理',
              value: '——'
            },
            {
              label: '未按时竣工',
              labelKey: '未按时竣工',
              value: '——'
            }
          ]
        },
        {
          title: '确认登记',
          top: [
            {
              // 10
              label: '已登记',
              labelKey: '已登记',
              value: '——'
            }
          ]
        }
      ]
    }
  },
  props: {
    settingConfig: {
      type: Object,
      default: null
    }
  },
  mounted() {
    // this.listData1 = JSON.parse(JSON.stringify(this.listData))
    this.getXcdhtData(this.nf)
    this.$nextTick(() => {
      this.setStyle()
    })
  },
  methods: {
    // 获取巡查导航图数据
    getXcdhtData(nf) {
      this.nf = nf
      this.$serviceAxios
        .post('http://23.36.123.33:38080/jdjg/selectXcdhtData', {
          nf,
          xzq: '渝中区,大渡口区,江北区,沙坪坝区,高新区,九龙坡区,南岸区,北碚区,渝北区,巴南区,两江新区,涪陵区,长寿区,江津区,合川区,永川区,南川区,綦江区,大足区,璧山区,铜梁区,潼南区,荣昌区,万盛区,双桥区,万州区,开州区,梁平区,城口县,丰都县,垫江县,忠县,云阳县,奉节县,巫山县,巫溪县,黔江区,武隆区,石柱县,秀山县,酉阳县,彭水县'
        })
        .then(res => {
          this.projectTotal = res.data.项目总数
          this.listData[0].top[0].value = res.data.已核发
            ? res.data.已核发
            : '——'
          this.listData[1].top[0].value = res.data.已会审
            ? res.data.已会审
            : '——'
          this.listData[2].top[0].value = res.data.已公告
            ? res.data.已公告
            : '——'
          this.listData[3].top[0].value = res.data.已签订
            ? res.data.已签订
            : '——'
          this.listData[3].bottom[1].value = res.data.未按时缴纳
            ? res.data.未按时缴纳
            : '——'
          this.listData[4].top[0].value = res.data.已交地
            ? res.data.已交地
            : '——'
          this.listData[4].top[1].value = res.data.已交地未按时交地
            ? res.data.已交地未按时交地
            : '——'
          this.listData[4].bottom[0].value = res.data.未交地
            ? res.data.未交地
            : '——'
          this.listData[4].bottom[1].value = res.data.未交地未按时交地
            ? res.data.未交地未按时交地
            : '——'
          this.listData[5].top[0].value = res.data.已公示
            ? res.data.已公示
            : '——'
          this.listData[6].top[0].value = res.data.用地规划许可已核发
            ? res.data.用地规划许可已核发
            : '——'
          this.listData[7].top[0].value = res.data.工程规划许可已核发
            ? res.data.工程规划许可已核发
            : '——'
          this.listData[8].top[0].value = res.data.已开工
            ? res.data.已开工
            : '——'
          this.listData[8].bottom[0].value = res.data.开工提醒
            ? res.data.开工提醒
            : '——'
          this.listData[8].bottom[1].value = res.data.未按时开工
            ? res.data.未按时开工
            : '——'
          this.listData[8].leaveUnused.xzList.value = res.data.闲置待认定
            ? res.data.闲置待认定
            : '——'
          this.listData[8].leaveUnused.xzyqdList.value = res.data.闲置已确定
            ? res.data.闲置已确定
            : '——'
          this.listData[8].leaveUnused.qyyyList[0].value = res.data.企业原因闲置
            ? res.data.企业原因闲置
            : '——'
          this.listData[8].leaveUnused.zfyyList[0].value = res.data.政府原因闲置
            ? res.data.政府原因闲置
            : '——'
          this.listData[9].top[0].value = res.data.竣工核实已核发
            ? res.data.竣工核实已核发
            : '——'
          this.listData[9].bottom[1].value = res.data.未按时竣工
            ? res.data.未按时竣工
            : '——'
          this.listData[10].top[0].value = res.data.已登记
            ? res.data.已登记
            : '——'
        })
        .catch(() => {
          this.$message.error('获取数据失败, 请稍后重试~')
        })
    },
    // 图形标题点击事件
    titleClick(items, title) {
      console.log(items, title)
      /* this.$emit('modeuleShow', {
                	moduleId: '963dc804be7946468bb5beca7bb144f7',
                	isShow: true
                }) */
    },
    // 类型变化事件
    typeChange(e) {
      if (e === '面积/金额') {
        this.listData = this.listData2
      } else {
        this.listData = this.listData1
      }
    },
    // 图形点击事件
    listClick(item, direction) {
      let condition, value
      const suoyin = direction.split('-')
      if (suoyin.length === 2) {
        condition = item[suoyin[0]][suoyin[1]].labelKey
        value = item[suoyin[0]][suoyin[1]].value
      } else {
        condition = item[suoyin[0]][suoyin[1]][suoyin[2]].labelKey
        value = item[suoyin[0]][suoyin[1]][suoyin[2]].value
      }
      if (!condition || value === '——') {
        return this.$message({
          message: '暂无数据',
          type: 'warning'
        })
      }
      // document.querySelector('.jdjg-time').style.display = 'none'
    },
    // 点击某项获取详情表格数据
    getJdjgDetailsData(condition, fn) {
      this.$serviceAxios
        .post('http://23.36.123.33:38080/jdjg/selectJdjgDetailsData', {
          condition: condition,
          pageCurrent: 1,
          pageSize: 20,
          nf: this.nf,
          xzqy: ''
          // 'xzqy': ['两江新区']
        })
        .then(res => {
          fn(res)
        })
    },
    // 模块样式设置
    setStyle() {
      this.$nextTick(() => {
        const jdjgScdht = document.querySelector('#jdjg-scdht')
        jdjgScdht.style['padding-top'] = '200px'
        const scdhtbox = jdjgScdht.querySelector('.scdht-box')
        scdhtbox.style['position'] = 'relative'
        scdhtbox.style['transform'] = 'scale(0.8)'
        const trunk = scdhtbox.querySelector('.trunk')
        trunk.style['padding'] = '0'
        trunk.style['margin'] = '100px 0 0 -25px'
        trunk.style['display'] = 'flex'
        trunk.style['position'] = 'relative'
        trunk.style['justify-content'] = 'flex-start'
        trunk.style['align-items'] = 'center'
        trunk.style['width'] = '1880px'
        // background: url(./images/mbarrow.jpg) no-repeat right 10px;
        const trunk_li = trunk.querySelectorAll('li')
        for (const item of trunk_li) {
          item.style['list-style'] = 'none'
          item.style['position'] = 'relative'
          item.style['z-index'] = '9'
        }
        const trunk_line = trunk.querySelector('p.line')
        trunk_line.style['height'] = '10px'
        trunk_line.style['width'] = '1850px'
        trunk_line.style['background'] = '#044f93'
        trunk_line.style['position'] = 'absolute'
        trunk_line.style['top'] = '20px'
        trunk_line.style['left'] = '0'
        const trunk_lists = trunk.querySelectorAll('.lists')
        for (const item of trunk_lists) {
          item.style['margin-left'] = '30px'
          item.style['width'] = '100px'
          item.style['font-weight'] = 'bold'
        }
        const trunk_lists_listbox = trunk.querySelectorAll('.lists .list-box')
        for (const item of trunk_lists_listbox) {
          item.style['height'] = '60px'
          item.style['width'] = '110px'
          item.style['text-align'] = 'center'
          item.style['border-radius'] = '5px'
          item.style['cursor'] = 'pointer'
        }
        const trunk_lists_listbox_p = trunk.querySelectorAll('.lists .list-box p')
        for (const item of trunk_lists_listbox_p) {
          item.style['line-height'] = '28px'
        }
        const trunk_title = trunk.querySelectorAll('.lists .title')
        for (const item of trunk_title) {
          item.style['width'] = '100px'
          item.style['height'] = '30px'
          item.style['text-align'] = 'center'
          item.style['line-height'] = '30px'
          item.style['border-radius'] = '5px'
          item.style['border'] = '1px solid #c9d2d0'
          item.style['color'] = 'white'
          item.style['font-weight'] = 'bold'
          item.style['letter-spacing'] = '2px'
          item.style['text-indent'] = '2px'
        }
        const trunk_child = trunk.querySelectorAll('.lists .child')
        for (const item of trunk_child) {
          item.style['position'] = 'absolute'
          item.style['min-height'] = '95px'
          item.style['width'] = '110px'
          item.style['right'] = '-5px'
          item.style['text-align'] = 'center'
        }
        const trunk_green = trunk.querySelectorAll('.lists .green')
        for (const item of trunk_green) {
          item.style['border'] = '1px solid #4bb90d'
        }
        const trunk_green_txt1 = trunk.querySelectorAll('.lists .green .txt1')
        for (const item of trunk_green_txt1) {
          item.style['background'] = 'linear-gradient(#65bd2e, #90ea80)'
          item.style['color'] = 'white'
        }
        const trunk_green_txt2 = trunk.querySelectorAll('.lists .green .txt2')
        for (const item of trunk_green_txt2) {
          item.style['background'] = 'linear-gradient(#d6f7d7, white)'
        }
        const trunk_top = trunk.querySelectorAll('.lists .top')
        for (const item of trunk_top) {
          item.style['bottom'] = '35px'
          // background: url(./images/jt_t.jpg) no-repeat bottom center;
        }
        const trunk_top1 = trunk.querySelectorAll('.lists .top1')
        for (const item of trunk_top1) {
          item.style['bottom'] = '135px'
          // background: url(./images/jt_t.jpg) no-repeat bottom center;
        }
        const trunk_bottom1 = trunk.querySelectorAll('.lists .bottom1')
        for (const item of trunk_bottom1) {
          item.style['top'] = '35px'
          // background: url(./images/jt_d.jpg) no-repeat top center
        }
        const trunk_bottom1_listbox = trunk.querySelectorAll('.lists .bottom1 .list-box')
        for (const item of trunk_bottom1_listbox) {
          item.style['margin-top'] = '35px'
        }
        const trunk_blue = trunk.querySelectorAll('.lists .blue')
        for (const item of trunk_blue) {
          item.style['border'] = '1px solid #2a8afe'
        }
        const trunk_blue_txt1 = trunk.querySelectorAll('.lists .blue .txt1')
        for (const item of trunk_blue_txt1) {
          item.style['background'] = 'linear-gradient(#2a8afe, #5face1)'
          item.style['color'] = 'white'
        }
        const trunk_blue_txt2 = trunk.querySelectorAll('.lists .blue .txt2')
        for (const item of trunk_blue_txt2) {
          item.style['background'] = 'linear-gradient(#d4ebfb, white)'
        }
        const trunk_bottom2 = trunk.querySelectorAll('.lists .bottom2')
        for (const item of trunk_bottom2) {
          item.style['top'] = '135px'
          // background: url(./images/jt_d.jpg) no-repeat top center
        }
        const trunk_bottom2_listbox = trunk.querySelectorAll('.lists .bottom2 .list-box')
        for (const item of trunk_bottom2_listbox) {
          item.style['margin-top'] = '35px'
        }
        const trunk_orange = trunk.querySelectorAll('.lists .orange')
        for (const item of trunk_orange) {
          item.style['border'] = '1px solid #e66800'
        }
        const trunk_orange_txt1 = trunk.querySelectorAll('.lists .orange .txt1')
        for (const item of trunk_orange_txt1) {
          item.style['background'] = 'linear-gradient(#e66800, #fb7500)'
          item.style['color'] = 'white'
        }
        const trunk_orange_txt2 = trunk.querySelectorAll('.lists .orange .txt2')
        for (const item of trunk_orange_txt2) {
          item.style['background'] = 'linear-gradient(#ffe6d1, white)'
        }
        const trunk_bottom3_xian = trunk.querySelectorAll('.lists .bottom3 .xian')
        for (const item of trunk_bottom3_xian) {
          item.style['width'] = '1px'
          item.style['height'] = '100px'
          item.style['margin'] = '3px auto 0'
          item.style['background'] = 'black'
        }
        const trunk_bottom3_xian2 = trunk.querySelectorAll('.lists .bottom3 .xian2')
        for (const item of trunk_bottom3_xian2) {
          item.style['width'] = '92px'
          item.style['height'] = '22px'
          item.style['margin'] = '0px auto 0'
          item.style['position'] = 'relative'
          item.style['left'] = '1px'
          item.style['left'] = '1px'
          // background: url(./images/jt_d.jpg) no-repeat bottom center
        }
        const trunk_bottom3_listbox = trunk.querySelectorAll('.lists .bottom3 .list-box')
        for (const item of trunk_bottom3_listbox) {
          item.style['margin-top'] = '15px'
        }
        const trunk_red = trunk.querySelectorAll('.lists .red')
        for (const item of trunk_red) {
          item.style['border'] = '1px solid #e66800'
        }
        const trunk_red_txt1 = trunk.querySelectorAll('.lists .red .txt1')
        for (const item of trunk_red_txt1) {
          item.style['background'] = 'linear-gradient(#de0f15, #c03d28)'
          item.style['color'] = 'white'
        }
        const trunk_red_txt2 = trunk.querySelectorAll('.lists .red .txt2')
        for (const item of trunk_red_txt2) {
          item.style['background'] = 'linear-gradient(#f3b1a6, white)'
        }
        const trunk_leaveUnused = trunk.querySelectorAll('.lists .leave-unused')
        for (const item of trunk_leaveUnused) {
          item.style['position'] = 'absolute'
          item.style['top'] = '230px'
          item.style['left'] = '-5px'
        }
        const trunk_leaveUnused_wrap = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap')
        for (const item of trunk_leaveUnused_wrap) {
          item.style['position'] = 'relative'
        }
        const trunk_leaveUnused_wrap_xian = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .xian')
        for (const item of trunk_leaveUnused_wrap_xian) {
          item.style['width'] = '1px'
          item.style['height'] = '30px'
          item.style['background'] = 'black'
          item.style['margin-left'] = '55px'
        }
        const trunk_leaveUnused_wrap_xian1 = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .xian1')
        for (const item of trunk_leaveUnused_wrap_xian1) {
          item.style['width'] = '110px'
          item.style['height'] = '30px'
          // background: url(./images/jt_d.jpg) no-repeat top center
        }
        const trunk_leaveUnused_box = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .leave-unused-box')
        for (const item of trunk_leaveUnused_box) {
          item.style['position'] = 'relative'
          item.style['top'] = '0'
          item.style['left'] = '0'
        }
        const trunk_leaveUnused_box_div = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .leave-unused-box>div')
        for (const item of trunk_leaveUnused_box_div) {
          item.style['position'] = 'relative'
          item.style['display'] = 'flex'
        }
        const trunk_leaveUnused_box_div_listBoxWrap = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .leave-unused-box>div .list-box-wrap')
        for (const item of trunk_leaveUnused_box_div_listBoxWrap) {
          item.style['padding-left'] = '20px'
          item.style['height'] = '60px'
          // background: url(./images/jt5.jpg) no-repeat 0 center;
        }
        const trunk_leaveUnused_box_div_listBoxWrap2 = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .leave-unused-box>div .list-box-wrap2')
        for (const item of trunk_leaveUnused_box_div_listBoxWrap2) {
          item.style['height'] = '140px'
          item.style['padding-left'] = '22px'
          item.style['position'] = 'relative'
          item.style['top'] = '-38px'
          item.style['left'] = '5px'
          // background: url(./images/jt3.jpg) no-repeat 0 center
        }
        const trunk_leaveUnused_box_div_listBoxWrap2_qyyy = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .leave-unused-box>div .list-box-wrap2 .qyyy')
        for (const item of trunk_leaveUnused_box_div_listBoxWrap2_qyyy) {
          item.style['margin-bottom'] = '20px'
        }
        const trunk_leaveUnused_box_div_listBoxWrap2_resion = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .leave-unused-box>div .list-box-wrap2 .resion')
        for (const item of trunk_leaveUnused_box_div_listBoxWrap2_resion) {
          item.style['display'] = 'flex'
          // background: url(./images/jt5.jpg) no-repeat 112px center
        }
        const trunk_leaveUnused_box_div_listBoxWrap2_resion_listbox = trunk.querySelectorAll('.lists .leave-unused .leave-unused-wrap .leave-unused-box>div .list-box-wrap2 .resion .list-box:nth-child(2)')
        for (const item of trunk_leaveUnused_box_div_listBoxWrap2_resion_listbox) {
          item.style['margin-left'] = '22px'
        }
        const trunk_list1_div = trunk.querySelectorAll('.list1 div')
        for (const item of trunk_list1_div) {
          item.style['width'] = '120px'
          item.style['height'] = '50px'
          item.style['background'] = '#2a4a9f'
          item.style['text-align'] = 'center'
          item.style['border-radius'] = '10px'
          item.style['box-shadow'] = '0 0 3px #2a4a9f'
          item.style['border'] = '1px solid #606266'
          item.style['background'] = 'radial-gradient(#26469b, #1260e4)'
        }
        const trunk_list1_div_firstP = trunk.querySelectorAll('.list1 div p:first-child')
        for (const item of trunk_list1_div_firstP) {
          item.style['font-size'] = '16px'
          item.style['color'] = 'white'
          item.style['padding-top'] = '5px'
          item.style['padding-top'] = '5px'
        }
        const trunk_list1_div_p = trunk.querySelectorAll('.list1 div p')
        for (const item of trunk_list1_div_p) {
          item.style['font-size'] = '14px'
          item.style['line-height'] = '20px'
          item.style['color'] = '#f5e703'
          item.style['font-weight'] = 'bold'
        }
        const first = ['#1a8f6e', '#d25286', '#49ef1b', '#49ef1b', '#c0b325', 'green', '#4581bf', '#a0af66', '#4cb54c', 'green', '#5e48b7', '#0091ff', '#080080', '#c31c59']
        const last = ['#31b38e', '#f591b6', '#8cda12', '#8cda12', '#bbc950', '#11b95c', '#1650bb', '#9ba04e', '#10ff00', '#11b95c', '#718be8', '#0083e6', '#1145b9', '#d34bc9']
        for (let i = 0; i < first.length; i++) {
          const currentList = trunk.querySelector(`.list${i + 2} .title`)
          console.log('currentList', currentList)
          if (currentList) {
            currentList.style['background'] = `radial-gradient(${first[i]}, ${last[i]})`
            currentList.style['box-shadow'] = `0 0 2px ${last[i]}`
          }
        }
      })
    }
  }
}
