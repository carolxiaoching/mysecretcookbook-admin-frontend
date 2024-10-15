<template>
  <div class="preview" v-if="isPreview">
    <a href="#" class="previewResetBtn" @click.prevent="resetImage('reset')">
      <i class="bi bi-x"></i>
    </a>

    <div class="previewImage" :style="{ backgroundImage: `url(${previewImageUrl})` }"></div>

    <a href="#" class="uploadImageBtn" @click.prevent="uploadImage">確定上傳</a>
  </div>

  <label for="image" class="uploadLabel" v-else>
    <span
      class="uploadLabelImage"
      :style="{ backgroundImage: `url(${tempImageUrl})` }"
      v-if="tempImageUrl"
    ></span>
    <span class="d-block fs-5" v-else>
      <i class="bi bi-cloud-arrow-up d-block display-3"></i>
      點擊上傳圖片
    </span>
    <span class="uploadLabelMask">編輯</span>
  </label>

  <input
    type="file"
    accept="image/*"
    id="image"
    name="image"
    class="d-none"
    @change="changeImage"
  />
</template>

<script setup>
import { ref } from 'vue';
import { loadingStore, messageStore } from '@/stores/index';
import { apiCreateImage } from '@/scripts/api';

const loadingRef = loadingStore();
const messageRef = messageStore();
const { openLoading, closeLoading } = loadingRef;
const { pushMessage } = messageRef;

defineProps({
  tempImageUrl: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['updateImage']);

const uploadFile = ref('');
const isPreview = ref(false);
const previewImageUrl = ref('');

// 更換並瀏覽圖片
function changeImage(event) {
  const image = event.target.files[0];

  if (image) {
    uploadFile.value = image;
    let url = window.URL.createObjectURL(image);
    previewImageUrl.value = url;
    isPreview.value = true;
  }
}

// 重置圖片
function resetImage() {
  uploadFile.value = '';
  previewImageUrl.value = '';
  isPreview.value = false;
  window.URL.revokeObjectURL(uploadFile.value);
}

// 上傳圖片
function uploadImage() {
  const formData = new FormData();
  formData.append('image', uploadFile.value);
  openLoading();
  apiCreateImage(formData, 'avatar')
    .then((res) => {
      const { status, data } = res.data;
      if (status === 'success') {
        pushMessage({
          style: 'success',
          title: '上傳成功',
          text: '上傳成功，請等待圖片載入',
        });
        emit('updateImage', data.imageUrl);
      } else {
        pushMessage({
          style: 'danger',
          title: '上傳失敗',
          text: '上傳失敗，請重整網頁',
        });
      }
      resetImage();
      closeLoading();
    })
    .catch((err) => {
      pushMessage({
        style: 'danger',
        title: '上傳失敗',
        text: err.response?.data?.message || '上傳失敗，請重整網頁',
      });
      closeLoading();
    });
}
</script>
