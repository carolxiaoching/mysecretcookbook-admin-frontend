<template>
  <VueApexCharts
    ref="categoriesChart"
    height="320"
    :options="categoriesOptions"
    :series="[]"
  ></VueApexCharts>
</template>

<script setup>
import { ref, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const categoriesChart = ref(null);
const tempCategories = ref([]);
const tempRecipes = ref([]);

const categoriesOptions = {
  chart: {
    height: '100px',
    width: '100px',
    type: 'pie',
    toolbar: {
      show: false,
    },
  },
  align: 'center',
  legend: {
    position: 'bottom',
  },
};

// 更新圖表
function updateChart() {
  // 使用 reduce 計算食譜中分類的數量： [{食譜id: 數量}]
  const categoryCount = tempRecipes.value.reduce((accumulator, recipe) => {
    // 若找不到則新增並賦予值 1
    if (!accumulator[recipe.category]) {
      accumulator[recipe.category] = 1;
    } else {
      // 找到則 +1
      accumulator[recipe.category] += 1;
    }
    return accumulator;
  }, {});

  // 取得分類名稱陣列： [分類1, 分類2, 分類3]
  const newLabels = tempCategories.value.map((category) => {
    return category.title;
  });

  // 取得食譜分類數量陣列： [分類1數量, 分類2數量, 分類3數量]
  const newSeries = tempCategories.value.map((category) => {
    // 在 categoryCount 找分類 id，如果找不到則為 0，找得到取得其值
    const num = categoryCount[category._id] ? categoryCount[category._id] || 0 : 0;
    return num;
  });

  // 渲染圖表
  categoriesChart.value.updateSeries(newSeries);
  categoriesChart.value.updateOptions({ labels: newLabels });
}

const props = defineProps({
  categories: {
    type: Object,
    default() {
      return [];
    },
  },
  recipes: {
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
