import axios from 'axios';

const { VITE_APIURL } = import.meta.env;
const api = VITE_APIURL;

// Member
export const apiAdminSignIn = (data) => axios.post(`${api}/admin/member/signIn`, data);
export const apiAdminCheckLoginStatus = () => axios.get(`${api}/admin/member/checkLoginStatus`);
export const apiGetMembers = () => axios.get(`${api}/admin/members`);
export const apiGetMember = (id) => axios.get(`${api}/admin/member/${id}`);
export const apiUpdateMember = (data, id) => axios.patch(`${api}/admin/member/${id}`, data);
export const apiDelMember = (id) => axios.delete(`${api}/admin/member/${id}`);

// Category
export const apiGetCategories = () => axios.get(`${api}/admin/categories`);
export const apiCreateCategory = (data) => axios.post(`${api}/admin/category`, data);
export const apiUpdateCategory = (data, id) => axios.patch(`${api}/admin/category/${id}`, data);
export const apiDelCategory = (id) => axios.delete(`${api}/admin/category/${id}`);

// Tag
export const apiGetTags = () => axios.get(`${api}/admin/tags`);
export const apiCreateTag = (data) => axios.post(`${api}/admin/tag`, data);
export const apiUpdateTag = (data, id) => axios.patch(`${api}/admin/tag/${id}`, data);
export const apiDelTag = (id) => axios.delete(`${api}/admin/tag/${id}`);

// Image
export const apiGetImages = () => axios.get(`${api}/admin/images`);
export const apiGetImage = (id) => axios.get(`${api}/admin/image/${id}`);
export const apiDelImage = (id) => axios.delete(`${api}/admin/image/${id}`);
export const apiCreateImage = (data, type) => axios.post(`${api}/admin/image?type=${type}`, data);

// Recipe
export const apiGetRecipes = () => axios.get(`${api}/admin/recipes`);
export const apiGetRecipe = (id) => axios.get(`${api}/admin/recipe/${id}`);
export const apiCreateRecipe = (data) => axios.post(`${api}/admin/recipe`, data);
export const apiUpdateRecipe = (data, id) => axios.patch(`${api}/admin/recipe/${id}`, data);
export const apiDelRecipe = (id) => axios.delete(`${api}/admin/recipe/${id}`);
