export const state = () => ({
  title: '',
  path: '',
})

export const mutations = {
  set_api: function(state, obj) {
    state.title = obj.title;
    state.path = obj.path;
  }
}