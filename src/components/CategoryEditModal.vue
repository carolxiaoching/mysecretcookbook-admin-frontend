<template>
  <div
    class="modal fade"
    id="categoryEditModal"
    tabindex="-1"
    aria-labelledby="categoryEditModalLabel"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    ref="categoryEditModalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content overflow-hidden">
        <VForm
          class="modal-body p-0"
          ref="form"
          v-slot="{ errors, meta, resetForm }"
          @submit="updateCategory"
        >
          <div class="p-11">
            <h1 class="modal-title title mb-8" id="categoryEditModalLabel">
              <span class="title-icon bg-dark-subtl">
                <i class="bi bi-pencil-fill"></i>
              </span>
              <slot name="modal-header">標題</slot>
            </h1>
            <div :class="{ 'mb-8': category.createdAt }">
              <label for="title" class="form-label">
                <span class="text-danger">*</span>
                分類標題：
              </label>
              <VField
                type="text"
                name="分類標題"
                id="title"
                class="form-control"
                :class="{
                  'is-invalid': errors['分類標題'],
                }"
                placeholder="請輸入分類標題"
                rules="required"
                v-model="category.title"
                required
              />
              <ErrorMessage name="分類標題" class="invalid-feedback" />
            </div>

            <div v-if="category.createdAt">
              <p>建立時間：{{ $getTime(category.createdAt) }}</p>
              <p>更新時間：{{ $getTime(category.updatedAt) }}</p>
            </div>
          </div>

          <div class="d-flex px-11 py-8 bg-light">
            <button
              type="button"
              class="w-50 btn btn-outline-primary me-8"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              取消
            </button>
            <button
              type="submit"
              aria-disabled="true"
              class="w-50 btn btn-primary"
              :class="{ disabled: !meta.valid }"
              :disabled="!meta.valid"
            >
              確定送出
            </button>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useModal } from '@/scripts/methods';
import { loadingStore, messageStore } from '@/stores/index';
import { apiCreateCategory, apiUpdateCategory } from '@/scripts/api';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;
const categoryEditModalRef = ref(null);
const { openModal, hideModal } = useModal(categoryEditModalRef);

const category = ref({
  id: '',
  title: '',
  createdAt: '',
  updatedAt: '',
});

defineExpose({
  openModal,
  hideModal,
});

const props = defineProps({
  tempCategory: {
    type: Object,
    default() {
      return {
        id: '',
        title: '',
        createdAt: '',
        updatedAt: '',
      };
    },
  },
});
const emit = defineEmits(['getCategories']);

// 動態監聽 props
watch(props, (nweProps) => {
  category.value = nweProps.tempCategory;
});

// 新增/更新分類
async function updateCategory(values, { resetForm }) {
  openLoading();
  const apiMethod = category.value.id ? apiUpdateCategory : apiCreateCategory;
  const msgTitle = category.value.id ? '更新' : '新增';

  try {
    const res = await apiMethod({ title: category.value.title }, category.value.id);
    const { status } = res.data;

    if (status === 'success') {
      pushMessage({
        style: 'success',
        title: `${msgTitle}成功`,
        text: `分類${msgTitle}成功，請等待載入畫面`,
      });
      resetForm();
      emit('getCategories');
    } else {
      pushMessage({
        style: 'danger',
        title: `${msgTitle}失敗`,
        text: `分類${msgTitle}失敗，請重整網頁`,
      });
    }
    closeLoading();
    hideModal();
  } catch (err) {
    pushMessage({
      style: 'danger',
      title: `${msgTitle}失敗`,
      text: err.response?.data?.message || `分類${msgTitle}失敗，請重整網頁`,
    });
    closeLoading();
  }
}
</script>
