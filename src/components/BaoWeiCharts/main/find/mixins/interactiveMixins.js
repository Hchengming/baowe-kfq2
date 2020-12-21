//模块交互功能实现
import serviceAxios from "@/utils/request.js";
import dataPresentation from "../../../components/SettingForm/dataPresentation.json";
export default {
    data() {
        return {
            beforeParamsData: [], //当前模块供选择参数
            interactiveModuleAll: [], //可交互模块集合
            interactiveData: [], //交互配置数据
            interactiveModuleId: "" //当前交互配置模块id
        };
    },
    methods: {
        // 图表组件集配置按钮点击事件
        chartsInteractiveSetting(reqObj) {

            //01-图表组件集交互数据配置---图表、iframe(当前模块)
            this.chartsInteractive(reqObj.statisticsAll);
            //02-当前页面所有可交互模块获取(交互模块)
            this.interactivePageData(reqObj.pageData);
            //03-交互配置数据获取
            this.getInteractiveData(() => {
                this.$refs["InteractiveSetting"].show();
            });
        },
        //顶部栏交互按钮点击事件
        topBarInteractiveIconClick(object) {
            console.log(object)
                //1、顶部栏组件集交互前数据配置
            this.beforeParamsData = [{ lab: '标题', val: 'title' }]

        },
        //图表组件集交互数据配置---图表、iframe
        chartsInteractive(statisticsAll) {
            this.interactiveModuleId = statisticsAll.moduleId;
            //判断是否为分页数据
            // let isPage=statisticsAll.contentAreaConfig.isPage;
            this.beforeParamsData = [];
            statisticsAll.contentAreaConfig.keyArr.forEach(item => {
                if (item.isShow) {
                    this.beforeParamsData.push({
                        lab: item.explain,
                        val: item.key
                    });
                }
            });
        },
        //当前页面所有可交互模块获取
        interactivePageData() {
            this.interactiveModuleAll = [];
            //一、所有图表图表、iframe
            const pageData = this.$refs['middleware'].pageData
            pageData.forEach(config => {
                if (config.moduleId !== this.interactiveModuleId) {
                    let moduleName = config.contentAreaConfig.title ?
                        config.contentAreaConfig.title :
                        "模块未命名";
                    //1、图表
                    if (!config.contentAreaConfig.moduleType ||
                        config.contentAreaConfig.moduleType === "0"
                    ) {
                        let interactiveParams = [];
                        //01-获取交付对应字段参数集合
                        config.conditionAreaConfig.screenData.forEach(item => {
                            interactiveParams.push({
                                lab: item.label,
                                val: item.key
                            });
                        });
                        this.interactiveModuleAll.push({
                            moduleId: config.moduleId,
                            moduleName,
                            type: config.contentAreaConfig.displayMode,
                            interactiveParams
                        });
                    } else if (config.contentAreaConfig.moduleType === "1") {
                        //2、iframe框
                        this.interactiveModuleAll.push({
                            moduleId: config.moduleId,
                            moduleName,
                            type: "iframe",
                            interactiveParams: []
                        });
                    }
                }
            });
            //二、顶部栏
            console.log(this.topBarAll)
        },
        //当前交互模块配置数据查询事件
        getInteractiveData(fn) {
            this.interactiveData = [];
            serviceAxios
                .post(this.settingConfig.commonUrl + "/jhConfig/selectJhConfig", {
                    moduleId: this.interactiveModuleId
                })
                .then(res => {
                    this.interactiveData = res.data ?
                        JSON.parse(res.data.interactiveData) : [];
                    fn();
                });
        },
        //模块交互配置数据保存事件
        interactiveDataEmit() {
            let reqObj = {
                moduleId: this.interactiveModuleId,
                interactiveData: this.interactiveData
            };
            serviceAxios
                .post(this.settingConfig.commonUrl + "/jhConfig/updateJhConfig", reqObj)
                .then(res => {
                    console.log(res);
                    this.$message({
                        type: "success",
                        message: "当前模块交互配置数据编辑成功"
                    });
                });
        },
        //模块交互触发
        interactiveElementMethods(reqObj) {
            //图表组件集配置按钮点击事件获取
            if (reqObj.methodsName === "interactive") {
                this.chartsInteractiveSetting(reqObj);
            }
            //表格单元格点击事件--触发模块交互
            if (reqObj.methodsName === "cellClick") {
                this.interactiveCellClick(reqObj);
            }
            //图表点击事件--触发模块交互
            if (reqObj.methodsName === "rowClick") {
                this.interactiveChartsClick(reqObj);
            }
        },
        //图表点击触发交互事件
        interactiveChartsClick(reqObj) {
            this.interactiveModuleId = reqObj.moduleId;
            let contentAreaConfig = reqObj.statisticsAll.contentAreaConfig;
            let arr = ['pie', 'ring', 'histogram', 'bar', 'line', 'radar']
            if (arr.indexOf(contentAreaConfig.displayMode) > -1) {
                this.interactiveCharts(reqObj)
            }
        },
        //表格、列表、详情通过表格单元格点击触发交互事件
        interactiveCellClick(reqObj) {
            this.interactiveModuleId = reqObj.moduleId;
            let contentAreaConfig = reqObj.statisticsAll.contentAreaConfig;
            if (['table', 'list', 'destailTable'].indexOf(contentAreaConfig.displayMode) > -1) {
                this.interactiveCharts(reqObj)
            }
        },
        // 图表点击触发交互公共事件
        interactiveCharts(reqObj) {
            // console.log('==============12345')
            //1-获取图表类型集合
            console.log(reqObj, 'reqObj')
            let chartsTypeArr = [];
            dataPresentation.forEach(obj => {
                chartsTypeArr.push(obj.type);
            });
            //2-根据图表类型确定触发方式
            this.getInteractiveData(() => {

                this.interactiveData.forEach(items => {
                    //单元格点击事件时判断点击字段是否为配置字段
                    let offon = reqObj.key ? reqObj.key === items.paramsChoose ? true : false : true
                    if (
                        items.otherModuleConfig.length > 0 &&
                        offon
                    ) {
                        items.otherModuleConfig.forEach(item => {
                            if (chartsTypeArr.indexOf(item.moduleType) > -1) {
                                //01-交互对象（表格、列表、图表、详情表格单元格）
                                let params = {};
                                params[item.corParams] = reqObj.rowItem[items.paramsChoose];
                                this.$refs["middleware"].interactiveCover(params, item.moduleId);
                            } else if (item.moduleType === 'iframe') {
                                //02-交互对象
                                // console.log(item.jsMethods)
                                const fnc = eval(`(false || ${item.jsMethods})`)
                                fnc({
                                    [item.corParams]: items.paramsChoose
                                })
                            }
                        });
                    }
                });
            });
        }
    }
};