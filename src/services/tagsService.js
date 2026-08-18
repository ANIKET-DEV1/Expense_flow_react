import apiClient from './baseApi';

const tagsService = {
  get_tags: async () => {
    const res = await apiClient.get('/tags/view_tags');
    return res.data;
  },

  add_tags: async (tag_name) => {
    const res = await apiClient.post('/tags/add_tags', tag_name);
    return res.data;
  },

  del_tags: async (tag_name) => {
    const res = await apiClient.delete(`/tags/delete_tag?tag=${tag_name}`);
    return res.data;
  }
};

export default tagsService;