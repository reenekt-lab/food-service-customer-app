export const state = () => ({
  address: ''
})

export const mutations = {
  set (state, value) {
    state.address = value
  },
  remove (state) {
    state.address = ''
  }
}
