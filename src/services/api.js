import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';
const API_BASE_URL = 'https://cattle-enterprises-profit-loss.onrender.com/api';
// const API_BASE_URL = 'https://cattle-enterprises-d61g.onrender.com/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    signup: (userData) => api.post('/auth/signup', userData),
    verifyOtp: (otpData) => api.post('/auth/verify-signup-otp', otpData),
    login: (credentials) => api.post('/auth/login', credentials),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
    deleteAccount: (identifier) => api.delete('/auth/delete-account', { data: { identifier } }),
};

export const expenseAPI = {
    addExpense: (expenseData) => api.post('/expense/add', expenseData),
    getUserExpenses: (userId) => api.get(`/expense/myexpenses/${userId}`),
    updateExpense: (id, userId, expenseData) => api.put(`/expense/update/${id}/${userId}`, expenseData),
    deleteExpense: (id, userId) => api.delete(`/expense/delete/${id}/${userId}`),
};

// 👇 NEW MILK API FUNCTIONS
export const milkAPI = {
    addMilkData: (milkData) => api.post('/milk/add', milkData),
    getUserMilkData: (userId) => api.get(`/milk/mydata/${userId}`),
    updateMilkData: (id, userId, milkData) => api.put(`/milk/update/${id}/${userId}`, milkData),
    deleteMilkData: (id, userId) => api.delete(`/milk/delete/${id}/${userId}`),
};

export const cowPurchaseAPI = {
    addCowPurchase: (purchaseData) => api.post('/cow-purchase/add', purchaseData),
    getUserPurchases: (userId) => api.get(`/cow-purchase/mydata/${userId}`),
    updateCowPurchase: (id, userId, purchaseData) => api.put(`/cow-purchase/update/${id}/${userId}`, purchaseData),
    deleteCowPurchase: (id, userId) => api.delete(`/cow-purchase/delete/${id}/${userId}`),
};

export const cowSaleAPI = {
    addCowSale: (saleData) => api.post('/cow-sale/add', saleData),
    getUserSales: (userId) => api.get(`/cow-sale/mydata/${userId}`),
    updateCowSale: (id, userId, saleData) => api.put(`/cow-sale/update/${id}/${userId}`, saleData),
    deleteCowSale: (id, userId) => api.delete(`/cow-sale/delete/${id}/${userId}`),
};

export const cowSalePostAPI = {
    addCowSalePost: (formData) => api.post('/cow-sale-post/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllPosts: () => api.get('/cow-sale-post/all'),
    getUserPosts: (mobileNumber) => api.get(`/cow-sale-post/my/${mobileNumber}`),
    updateCowSalePost: (id, mobileNumber, postData) => api.put(`/cow-sale-post/update/${id}/${mobileNumber}`, postData),
    deleteCowSalePost: (id, mobileNumber) => api.delete(`/cow-sale-post/delete/${id}/${mobileNumber}`),
};

export const marketPostAPI = {
    addPost: (formData) => api.post('/market-post/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAllPosts: () => api.get('/market-post/all'),
    getUserPosts: (mobileNumber) => api.get(`/market-post/user/${mobileNumber}`),
    getByCategory: (category) => api.get(`/market-post/category/${category}`),
    updatePost: (id, mobileNumber, postData) => api.put(`/market-post/update/${id}/${mobileNumber}`, postData),
    deletePost: (id, mobileNumber) => api.delete(`/market-post/delete/${id}/${mobileNumber}`),
};

export const buyRecordAPI = {
    addBuy: (buyData) => api.post('/buy/add', buyData),
    getUserBuys: (userId) => api.get(`/buy/mydata/${userId}`),
    updateBuy: (id, userId, buyData) => api.put(`/buy/update/${id}/${userId}`, buyData), // PATCH → PUT
    deleteBuy: (id, userId) => api.delete(`/buy/delete/${id}/${userId}`),
};

export const saleRecordAPI = {
    addSale: (saleData) => api.post('/sale-records/add', saleData),
    getSalesByUser: (userId) => api.get(`/sale-records/user/${userId}`),
    getSalesByCategory: (category) => api.get(`/sale-records/category/${category}`),
    getSalesByDate: (date) => api.get(`/sale-records/date/${date}`),
    updateSale: (id, saleData) => api.put(`/sale-records/update/${id}`, saleData), // PATCH → PUT
    deleteSale: (id) => api.delete(`/sale-records/delete/${id}`),
};

// 👇 PROFIT/LOSS API ADD PANNU
export const profitLossAPI = {
    getProfitLoss: (userId) => api.get(`/profit/${userId}`),
};

export default api;