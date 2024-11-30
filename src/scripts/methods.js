import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

// Modal
export function useModal(modalRef) {
  const modal = ref(null);

  onMounted(() => {
    modal.value = new Modal(modalRef.value);
  });

  const openModal = () => {
    modal.value?.show();
  };

  const hideModal = () => {
    modal.value?.hide();
  };

  return {
    modal,
    openModal,
    hideModal,
  };
}

// token 相關

export const setToken = (token) => {
  const expries = new Date(Date.now() + 1000 * 60 * 60 * 24).toGMTString();
  document.cookie = `mySecretCookbook=${token}; expires=${expries}; path=/`;
};

export const getToken = () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)mySecretCookbook\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  );
  return token;
};

export const clearToken = () => {
  document.cookie = 'mySecretCookbook=;expires=;path=/';
};

// 取得時間
export const getTime = (time) => {
  const newTime = new Date(time);
  const year = newTime.getFullYear();
  const month = newTime.getMonth() < 9 ? `0${newTime.getMonth() + 1}` : newTime.getMonth() + 1;
  const date = newTime.getDate() < 9 ? `0${newTime.getDate()}` : newTime.getDate();
  const hour = newTime.getHours() < 10 ? `0${newTime.getHours()}` : newTime.getHours();
  const minutes = newTime.getMinutes() < 10 ? `0${newTime.getMinutes()}` : newTime.getMinutes();
  return `${year}/${month}/${date} ${hour}:${minutes}`;
};

// 取得頁碼與此頁資料
export function getPageDataAndPagination(data, nowPage = 1) {
  // 每頁幾筆
  const perPage = 10;

  // 資料總數
  const totalResult = data.length;

  // 總共有幾頁
  const totalPage = Math.ceil(totalResult / perPage);

  // 若 totalPage 小於等於 perPage，則所在頁面變為 totalPage 頁，否則就依照傳入 nowPage 參數
  const currentPage = totalPage <= nowPage ? totalPage : nowPage;

  // 此頁數最小為資料為第x筆
  const minItem = currentPage * perPage - perPage + 1;
  // 此頁數最大資料為第x筆
  const maxItem = currentPage * perPage;

  // 取得此頁面資料
  const result = data.filter((item, i) => i + 1 >= minItem && i + 1 <= maxItem);
  const pagination = {
    totalPage,
    currentPage,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPage,
  };

  return {
    result,
    pagination,
  };
}

// 利用分類 ID 取得分類名稱
export function getCategoryName(categoriesValue, categoryId) {
  const category = categoriesValue.find((item) => item._id === categoryId);
  return category ? category.title : '未分類';
}

// 利用標籤 ID 取得標籤名稱
export function getTagName(tagsValue, tagId) {
  const tag = tagsValue.find((item) => item._id === tagId);
  return tag ? tag.title : '';
}
