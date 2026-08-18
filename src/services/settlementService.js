import apiClient from './baseApi';

const settlementsService = {
  get_settlements: async () => {
    const res = await apiClient.get('/settlements/View_debt');
    return res.data;
  },

  add_settlements: async (debtData) => {
    const res = await apiClient.post('/settlements/Add_debt', debtData);
    return res.data;
  },

  del_settlements: async (del_id) => {
    const res = await apiClient.delete(`/settlements/delete_debt?del_id=${del_id}`);
    return res.data;
  },

  update_settlements: async (int_id, debtData) => {
    const res = await apiClient.put(`/settlements/update_debt?int_id=${int_id}`, debtData);
    return res.data;
  }
};

export default settlementsService;