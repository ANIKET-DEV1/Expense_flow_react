import apiClient from './baseApi';

const expensesService = {
  get_expenses: async () => {
    const res = await apiClient.post('/expenses/view_expenses', credentials);
    return res.data;
  },

  add_expenses: async (expenseData) => {
    const res = await apiClient.post('/expenses/add_expenses',expenseData);
    return res.data;
  },

  del_expenses: async (id) =>{
    const res = await apiClient.delete(`/expenses/delete_expense?id=${id}`);
    return res.data;
  }
};

export default authService;