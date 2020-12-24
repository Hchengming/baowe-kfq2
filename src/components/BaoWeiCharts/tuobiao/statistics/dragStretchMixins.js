// let _this
export default {
    data() {
        return {
            // 模块位置设置
            modelStyle: {
                width: 353,
                height: 230,
                top: 300,
                left: 10
            },
            // 模块修改表单设置
            settingForm: {},
            // 拖拽图标样式设置
            // TZStyle: {},
            // 内容区域宽高
            mainStyle: {
                width: null,
                height: null,
                offsetTop: null,
                offsetLeft: null
            },
            cursor: 'defalut'
                // shubiaoMove: '' // 鼠标拖拽状态样式
        }
    },
    watch: {
        'statisticsAll.contentAreaConfig' () {
            this.settingForm = JSON.parse(
                JSON.stringify(this.statisticsAll.contentAreaConfig)
            )
            this.getMainStyle()
            this.setDemos()
        },
        deep: true
    },
    mounted() {
        this.getMainStyle()
        this.settingForm = JSON.parse(
            JSON.stringify(this.statisticsAll.contentAreaConfig)
        )
        this.setDemos()
        this.getDemos()
    },
    methods: {
        // 内容区域宽高获取
        getMainStyle() {
            const element = document.getElementsByClassName('my_main_content')[0]
            this.mainStyle.width = element.scrollWidth
            this.mainStyle.height = element.scrollHeight
        },
        // 图表宽高设置
        setDemos() {
            // this.modelStyle.height = this.settingForm.height
            if (this.settingForm.height <= 100) {
                this.modelStyle.height = parseFloat(
                    (this.settingForm.height * this.mainStyle.height) / 100
                )
            } else {
                this.modelStyle.height = this.settingForm.height
            }

            this.modelStyle.width = parseFloat(
                (this.settingForm.width * this.mainStyle.width) / 100
            )
            if (this.settingForm.height <= 100) {
                this.modelStyle.top = parseFloat(
                    (this.settingForm.top * this.mainStyle.height) / 100
                )
            } else {
                this.modelStyle.top = this.settingForm.top
            }

            this.modelStyle.left = parseFloat(
                (this.settingForm.left * this.mainStyle.width) / 100
            )
            console.log(this.modelStyle)
        },
        // 获取模块初始位置和宽高
        getDemos() {
            if (this.modelStyle.height / this.mainStyle.height <= 100) {
                this.settingForm.height =
                    (this.modelStyle.height / this.mainStyle.height) * 100
            } else {
                this.settingForm.height = this.modelStyle.height
            }
            this.settingForm.width =
                (this.modelStyle.width / this.mainStyle.width) * 100

            if (this.modelStyle.height / this.mainStyle.height <= 100) {
                this.settingForm.top =
                    (this.modelStyle.top / this.mainStyle.height) * 100
            } else {
                this.settingForm.top = this.modelStyle.top
            }
            // console.log(this.modelStyle.height, this.settingForm.top)
            this.settingForm.left =
                (this.modelStyle.left / this.mainStyle.width) * 100
        },
        // 拖拽图标显示、样式控制
        // setTZStyle (display, left, top) {
        //   this.TZStyle = {
        //     display: display,
        //     left: left + 'px',
        //     top: top + 'px'
        //   }
        // },
        // 模块拖拽事件e
        mousedown_tz(e) {
            // console.log('mousedown')
            const _this = this
                //  设置定时器，鼠标按下一秒后启动拖拽事件
            var timer = null
            var mousedownTzZx = null
            this.cursor = ''
            clearTimeout(timer)
                // console.log(this.settingForm.isDrafting)
            timer = setTimeout(() => {
                // 权限控制
                if (this.isAdmin || this.settingForm.isDrafting === true) {
                    mousedownTzZx(e)
                    this.cursor = 'move'
                }
            }, 200)
            const drag = this.$refs['statisticsWrap']
            mousedownTzZx = e => {
                const event = e || window.event // 兼容IE浏览器

                var diffX = event.clientX - drag.offsetLeft
                var diffY = event.clientY - drag.offsetTop
                const element = document.getElementsByClassName('my_main_content')[0]
                if (typeof drag.setCapture !== 'undefined') {
                    drag.setCapture()
                }
                document.onmousemove = function(event) {
                    // console.log('onmousemove')
                    // eslint-disable-next-line no-redeclare
                    var event = event || window.event
                    var moveX = event.clientX - diffX
                    var moveY = event.clientY - diffY
                    if (moveX <= 0) {
                        moveX = 0
                    } else if (moveX > element.scrollWidth - drag.offsetWidth) {
                        moveX = element.scrollWidth - drag.offsetWidth
                    }

                    if (moveY <= 0) {
                        moveY = 0
                    } else if (moveY > element.scrollHeight - drag.offsetHeight) {
                        moveY = element.scrollHeight - drag.offsetHeight
                    }

                    _this.modelStyle.left = moveX
                    _this.modelStyle.top = moveY

                    _this.getDemos()
                }
            }
            document.onmouseup = function() {
                this.onmousemove = null
                this.onmouseup = null
                clearTimeout(timer)
                    // console.log('onmouseup')
                if (_this.cursor === 'move' && _this.isAdmin) {
                    _this.TZLSKeep()
                }
                _this.cursor = ''
                    // 修复低版本ie bug
                if (typeof drag.releaseCapture !== 'undefined') {
                    drag.releaseCapture()
                }
            }
        },
        // 左侧缩放
        mousedown_left_ls(e) {
            this.mousedown_ls(e, 'left')
        },
        // 右侧缩放
        mousedown_right_ls(e) {
            this.mousedown_ls(e, 'right')
        },
        // 模块拉伸事件
        mousedown_ls(event, type) {
            // console.log('mousedown')
            const _this = this
            this.stopPropagation(event)
            this.stopDefault(event)
                // let event = e || windeow.event;  //兼容IE浏览器
            const drag = this.$refs['statisticsWrap']
            const diffX = event.clientX
            const diffY = event.clientY

            if (typeof drag.setCapture !== 'undefined') {
                drag.setCapture()
            }
            const modelStyleClone = JSON.parse(JSON.stringify(_this.modelStyle))
            const width = modelStyleClone.width
            const height = modelStyleClone.height
            const left = modelStyleClone.left
            document.onmousemove = function(event) {
                // eslint-disable-next-line no-redeclare
                var event = event || window.event
                const moveX = event.clientX - diffX
                const moveY = event.clientY - diffY
                    //模块最小宽高限制
                let offon = false;
                if (type === 'left') {
                    if (width - moveX > 100) {
                        offon = true
                        _this.modelStyle.width = width - moveX
                        _this.modelStyle.left = left + moveX
                    }

                } else {
                    if (width + moveX > 100) {
                        offon = true
                        _this.modelStyle.width = width + moveX
                    }

                }
                if (offon && height + moveY > 100) {
                    _this.modelStyle.height = height + moveY
                    _this.getDemos()
                }
            }
            document.onmouseup = function() {
                this.onmousemove = null
                this.onmouseup = null
                    // 修复低版本ie bug
                if (typeof drag.releaseCapture !== 'undefined') {
                    drag.releaseCapture()
                }
                _this.TZLSKeep()
            }
        },
        // 阻止事件冒泡
        stopPropagation(event) {
            // 如果提供了事件对象，则这是一个非IE浏览器
            if (event && event.stopPropagation) {
                // 因此它支持W3C的stopPropagation()方法
                event.stopPropagation()
            } else {
                // 否则，我们需要使用IE的方式来取消事件冒泡
                window.event.cancelBubble = true
            }
        },
        // 阻止浏览器默认事件
        stopDefault(e) {
            // 阻止默认浏览器动作(W3C)
            if (e && e.preventDefault) e.preventDefault()
                // IE中阻止函数器默认动作的方式
            else window.event.returnValue = false
            return false
        },
        // 模块拖拽拉伸后保存事件
        TZLSKeep() {
            this.$emit(
                'updateMoule',
                this.settingForm,
                this.statisticsAll.moduleId,
                () => {
                    // this.$message({
                    //     type: 'success',
                    //     message: '模块布局保存成功!'
                    // });
                },
                this.whereForm
            )
        }
    }
}