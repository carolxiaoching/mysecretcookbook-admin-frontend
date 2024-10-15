<template>
  <div class="container-fluid">
    <h1 class="mb-14 h3">控制台</h1>
    <div class="row mb-16">
      <div class="col-4" v-for="(item, index) in stats" :key="index">
        <div
          class="d-flex justify-content-around align-items-center p-11 bg-white rounded shadow-sm"
        >
          <div class="d-none d-lg-block px-11 py-8 bg-light rounded-circle">
            <i class="display-5" :class="item.icon"></i>
          </div>
          <div class="text-end text-muted">
            <h3 class="mb-8 fs-6">{{ item.name }}</h3>
            <p>
              <span class="me-4 text-dark display-6 fw-medium">{{ item.num }}</span>
              {{ item.unit }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row gy-16">
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="title-icon bg-secondary-subtle">
              <i class="bi bi-people-fill"></i>
            </span>
            <span> 分類比例 </span>
          </h2>
          <PieChartComponent :categories="categories" :recipes="recipes" />
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="title-icon bg-secondary-subtle">
              <i class="bi bi-people-fill"></i>
            </span>
            <span> 會員增長 </span>
          </h2>
          <LineChartComponent :members="members" />
        </div>
      </div>
      <div class="col-12">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="title-icon bg-secondary-subtle">
              <i class="bi bi-people-fill"></i>
            </span>
            <span> 食譜增長 </span>
          </h2>
          <div class="text-center">
            <AreaChartComponent :categories="categories" :recipes="recipes" />
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="title-icon bg-secondary-subtle">
              <i class="bi bi-people-fill"></i>
            </span>
            <span> 最新會員 </span>
          </h2>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="table-active">
                  <th class="text-center" width="120">ID 編號</th>
                  <th class="text-center">會員</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in members.slice(0, 5)" :key="item._id">
                  <td class="text-center">#{{ item._id.substring(-1, 5) }}</td>
                  <td class="text-center">
                    <div class="d-flex justify-content-center align-items-center">
                      <img
                        :src="item.avatarImgUrl"
                        class="thumbnail me-16 rounded-circle"
                        v-if="item.avatarImgUrl"
                      />
                      <div class="thumbnailDefault me-16 rounded-circle" v-else>
                        <i class="bi bi-person-fill"></i>
                      </div>
                      <p>
                        {{ item.nickName }}
                        <span class="d-block">{{ item.email }}</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="h-100 p-16 bg-white rounded shadow-sm">
          <h2 class="title mb-11">
            <span class="title-icon bg-secondary-subtle">
              <i class="bi bi-cookie"></i>
            </span>
            <span> 最新食譜 </span>
          </h2>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="table-active">
                  <th class="text-center" width="120">ID 編號</th>
                  <th class="text-center">食譜名稱</th>
                  <th class="text-center">食譜分類</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recipes.slice(0, 5)" :key="item._id">
                  <td class="text-center">#{{ item._id.substring(-1, 5) }}</td>
                  <td class="text-center">
                    <div class="d-flex justify-content-center align-items-center">
                      <img :src="item.coverImgUrl" class="thumbnail me-4" v-if="item.coverImgUrl" />
                      <div class="thumbnailDefault me-4" v-else>
                        <i class="bi bi-person-fill"></i>
                      </div>
                      {{ item.title }}
                    </div>
                  </td>
                  <td class="text-center">
                    {{ getCategoryName(categories, item.category) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { apiGetMembers, apiGetRecipes, apiGetCategories } from '@/scripts/api';
import { loadingStore, messageStore } from '@/stores/index';
import { getCategoryName } from '@/scripts/methods';
import PieChartComponent from '@/components/PieChart.vue';
import LineChartComponent from '@/components/LineChart.vue';
import AreaChartComponent from '@/components/AreaChart.vue';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const members = ref([]);
const recipes = ref([]);
const categories = ref([]);

const stats = ref({
  members: {
    icon: 'bi bi-people-fill',
    name: '會員人數',
    num: 0,
    unit: '人',
  },
  recipes: {
    icon: 'bi bi-cookie',
    name: '食譜數量',
    num: 0,
    unit: '篇',
  },
  categories: {
    icon: 'bi bi-columns-gap',
    name: '分類數量',
    num: 0,
    unit: '個',
  },
});

async function getData() {
  try {
    openLoading();
    const membersResponse = await apiGetMembers();
    const recipesResponse = await apiGetRecipes();
    const categoriesResponse = await apiGetCategories();

    members.value = membersResponse.data.data;
    recipes.value = recipesResponse.data.data;
    categories.value = categoriesResponse.data.data;

    stats.value.members.num = members.value.length;
    stats.value.recipes.num = recipes.value.length;
    stats.value.categories.num = categories.value.length;

    closeLoading();
  } catch (error) {
    pushMessage({
      style: 'danger',
      title: '載入失敗',
      text: error.response?.data?.message || '載入失敗，請重整網頁',
    });
    closeLoading();
  }
}

onBeforeMount(() => {
  getData();
});
</script>
