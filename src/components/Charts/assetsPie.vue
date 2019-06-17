<template>
  <div  :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
   import echarts from 'echarts';

   export default {
     props: {
       className: {
         type: String,
         default: 'chart'
       },
       id: {
         type: String,
         default: 'chart'
       },
       width: {
         type: String,
         default: '95%'
       },
       height: {
         type: String,
         default: '700px'
       },
       option: {
         type: Object
       }
     },
     data() {
       return {
         chart: null
       };
     },
     watch: {
        // 观察option的变化
       option: {
         handler(newVal, oldVal) {
           if (this.chart) {
             if (newVal) {
               this.chart.setOption(newVal);
             } else {
               this.chart.setOption(oldVal);
             }
           } else {
             this.initChart();
           }
         },
         deep: true // 对象内部属性的监听，关键。
       }
     },
     mounted() {
       this.initChart();
     },
     beforeDestroy() {
       if (!this.chart) {
         return
       }
       this.chart.dispose();
       this.chart = null;
     },
     methods: {
       initChart() {
         this.chart = echarts.init(document.getElementById(this.id));
         this.chart.setOption(this.option);
       }
     }
   }
</script>
