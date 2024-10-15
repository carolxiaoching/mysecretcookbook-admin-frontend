<template>
  <VueApexCharts
    ref="membersChart"
    height="320"
    :options="membersOptions"
    :series="[]"
  ></VueApexCharts>
</template>

<script setup>
import { ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const membersChart = ref(null);
const tempMembers = ref([]);

const membersOptions = ref({
  tooltip: {
    enabled: false,
  },
  chart: {
    height: '100px',
    type: 'line',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: 'smooth',
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
  },
});

// 處理圖表
function updateChart() {
  // 初始化 12 個月份，預設數量為 0
  const newSeries = {
    name: '用戶',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  tempMembers.value.forEach((member) => {
    const date = new Date(member.createdAt);
    // 取得食譜的月份 (0-11)
    const month = date.getMonth();

    // 該月份的會員數量加1
    newSeries.data[month] += 1;
  });

  // 渲染畫面
  membersChart.value.updateSeries([newSeries]);
}

const props = defineProps({
  members: {
    type: Object,
    default() {
      return [];
    },
  },
});

// 動態監聽 props
watch(props, (nweProps) => {
  tempMembers.value = nweProps.members;
  updateChart();
});
</script>
