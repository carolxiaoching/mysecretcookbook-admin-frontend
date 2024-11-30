<template>
  <VueApexCharts
    ref="recipesChart"
    height="320"
    :options="recipesOptions"
    :series="[]"
  ></VueApexCharts>
</template>

<script setup>
import { ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { getCategoryName } from '@/scripts/methods';

const recipesChart = ref(null);
const tempCategories = ref([]);
const tempRecipes = ref([]);

const recipesOptions = ref({
  chart: {
    height: '100px',
    type: 'area',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: true,
  },
  tooltip: {
    enabled: false,
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
  const newSeries = tempCategories.value.map((category) => ({
    name: category.title,
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  }));

  tempRecipes.value.forEach((recipe) => {
    const date = new Date(recipe.createdAt);
    // 取得食譜的月份 (0-11)
    const month = date.getMonth();

    // 找到對應的分類名稱
    const categoryName = getCategoryName(tempCategories.value, recipe.category);

    // 取得第幾筆
    const index = newSeries.findIndex((item) => {
      return item.name === categoryName;
    });

    // 若有資料則更新資料
    if (index !== -1) {
      // 該月份的食譜數量+1
      newSeries[index].data[month] += 1;
    }
  });

  // 渲染畫面
  recipesChart.value.updateSeries(newSeries);
}

const props = defineProps({
  recipes: {
    type: Object,
    default() {
      return [];
    },
  },
  categories: {
    type: Object,
    default() {
      return [];
    },
  },
});

// 動態監聽 props
watch(props, (nweProps) => {
  tempCategories.value = nweProps.categories;
  tempRecipes.value = nweProps.recipes;
  updateChart();
});
</script>
