export default {
    methods: {
        setLineAxis(options) {
            this.setBarAxis(options)
        },
        setLineSeries(options) {
            this.chartColumns.forEach(items => {
                let obj = {
                    name: items.title,
                    type: 'line',
                    barGap: 0,
                    data: []
                }
                this.data.forEach(item => {
                    obj.data.push(item[items.key])
                })
                options.series.push(obj)
            })
        }
    }
}