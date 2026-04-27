<template>
  <div class="sankey-page">
    <div class="chart-header">
      <h2>Interface Mapping Sankey</h2>
      <p class="hint">A reusable pure-line Sankey showcasing multi-layer interface mapping.</p>
    </div>
    <div ref="chartRef" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, SankeySeriesOption } from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const sankeyOption: EChartsOption = {
  title: {
    text: '接口多层级映射（纯配置-多数据+高复用+纯线条）',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      color: '#333',
    },
  },
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    formatter: function (params: any) {
      const param = params as echarts.SankeyTooltipFormatterParams
      if (param.type === 'node') {
        return `<div style="padding:6px;min-width:120px;">
                  <b>【${param.data.categoryName}】</b><br>
                  节点：${param.name}
                </div>`
      } else if (param.type === 'link') {
        return `<div style="padding:6px;min-width:120px;">
                  <b>映射关系</b><br>
                  ${param.sourceName} → ${param.targetName}
                </div>`
      }
      return ''
    },
  },
  series: [
    {
      type: 'sankey',
      left: 20,
      right: 20,
      top: 30,
      bottom: 30,
      nodeWidth: 22,
      nodeGap: 12,
      lineGap: 3,
      label: {
        show: true,
        fontSize: 11,
        align: 'left',
        padding: [2, 0],
        formatter: (params: echarts.SankeyNodeItemOption) => {
          const name = params.name as string
          return name.length > 10 ? `${name.slice(0, 10)}...` : name
        },
      },
      data: [
        { name: '系统主入口接口', level: 0, category: 0, categoryName: '入口层' },
        { name: '动作映射_用户模块', level: 1, category: 1, categoryName: '动作/外部映射层' },
        { name: '动作映射_订单模块', level: 1, category: 1, categoryName: '动作/外部映射层' },
        { name: '动作映射_商品模块', level: 1, category: 1, categoryName: '动作/外部映射层' },
        { name: '动作映射_支付模块', level: 1, category: 1, categoryName: '动作/外部映射层' },
        { name: '动作映射_物流模块', level: 1, category: 1, categoryName: '动作/外部映射层' },
        { name: '外部接口_用户查询', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_用户新增', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_订单创建', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_订单查询', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_商品列表', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_商品详情', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_支付发起', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_支付回调', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_物流轨迹', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_物流签收', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_通用查询', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '外部接口_通用同步', level: 2, category: 2, categoryName: '外部接口层' },
        { name: '内部核心接口_数据查询', level: 3, category: 3, categoryName: '内部接口层' },
        { name: '内部核心接口_数据写入', level: 3, category: 3, categoryName: '内部接口层' },
        { name: '内部核心接口_状态同步', level: 3, category: 3, categoryName: '内部接口层' },
        { name: '内部核心接口_结果回调', level: 3, category: 3, categoryName: '内部接口层' },
      ] as echarts.SankeyNodeItemOption[],
      links: [
        { source: '系统主入口接口', target: '动作映射_用户模块', value: 1 },
        { source: '系统主入口接口', target: '动作映射_订单模块', value: 1 },
        { source: '系统主入口接口', target: '动作映射_商品模块', value: 1 },
        { source: '系统主入口接口', target: '动作映射_支付模块', value: 1 },
        { source: '系统主入口接口', target: '动作映射_物流模块', value: 1 },
        { source: '动作映射_用户模块', target: '外部接口_用户查询', value: 1 },
        { source: '动作映射_用户模块', target: '外部接口_用户新增', value: 1 },
        { source: '动作映射_订单模块', target: '外部接口_订单创建', value: 1 },
        { source: '动作映射_订单模块', target: '外部接口_订单查询', value: 1 },
        { source: '动作映射_商品模块', target: '外部接口_商品列表', value: 1 },
        { source: '动作映射_商品模块', target: '外部接口_商品详情', value: 1 },
        { source: '动作映射_支付模块', target: '外部接口_支付发起', value: 1 },
        { source: '动作映射_支付模块', target: '外部接口_支付回调', value: 1 },
        { source: '动作映射_物流模块', target: '外部接口_物流轨迹', value: 1 },
        { source: '动作映射_物流模块', target: '外部接口_物流签收', value: 1 },
        { source: '动作映射_用户模块', target: '外部接口_通用查询', value: 1 },
        { source: '动作映射_订单模块', target: '外部接口_通用同步', value: 1 },
        { source: '外部接口_用户查询', target: '内部核心接口_数据查询', value: 1 },
        { source: '外部接口_订单查询', target: '内部核心接口_数据查询', value: 1 },
        { source: '外部接口_商品列表', target: '内部核心接口_数据查询', value: 1 },
        { source: '外部接口_商品详情', target: '内部核心接口_数据查询', value: 1 },
        { source: '外部接口_物流轨迹', target: '内部核心接口_数据查询', value: 1 },
        { source: '外部接口_通用查询', target: '内部核心接口_数据查询', value: 1 },
        { source: '外部接口_用户新增', target: '内部核心接口_数据写入', value: 1 },
        { source: '外部接口_订单创建', target: '内部核心接口_数据写入', value: 1 },
        { source: '外部接口_物流签收', target: '内部核心接口_数据写入', value: 1 },
        { source: '外部接口_支付发起', target: '内部核心接口_状态同步', value: 1 },
        { source: '外部接口_通用同步', target: '内部核心接口_状态同步', value: 1 },
        { source: '外部接口_支付回调', target: '内部核心接口_结果回调', value: 1 },
      ] as echarts.SankeyLinkItemOption[],
      categories: [
        { name: '入口层', itemStyle: { color: '#409EFF', borderColor: '#fff', borderWidth: 1 } },
        { name: '动作/外部映射层', itemStyle: { color: '#67C23A', borderColor: '#fff', borderWidth: 1 } },
        { name: '外部接口层', itemStyle: { color: '#E6A23C', borderColor: '#fff', borderWidth: 1 } },
        { name: '内部接口层', itemStyle: { color: '#F56C6C', borderColor: '#fff', borderWidth: 1 } },
      ] as echarts.SankeyCategoryItemOption[],
      lineStyle: {
        color: '#86909C',
        curveness: 0.12,
        width: 1.5,
        opacity: 0.9,
        type: 'solid',
      } as SankeySeriesOption['lineStyle'],
      itemStyle: {
        emphasis: {
          shadowBlur: 8,
          shadowColor: 'rgba(0,0,0,0.2)',
          borderWidth: 2,
        },
      } as SankeySeriesOption['itemStyle'],
    } as SankeySeriesOption,
  ],
}

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(sankeyOption)
}

const resizeHandler = () => {
  chartInstance?.resize()
}

onMounted(async () => {
  await nextTick()
  initChart()
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped>
.sankey-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chart-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.chart-header .hint {
  margin: 4px 0 0;
  color: #666;
  font-size: 13px;
}
.chart {
  height: 520px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}
</style>
