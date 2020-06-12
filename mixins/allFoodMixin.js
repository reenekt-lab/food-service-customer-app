export default {
  data () {
    return {
      allFood: {
        data: [],
        loading: false,
        allLoaded: false,
        maxLoadTimes: 40,
        loadedPagesCount: 0
      }
    }
  },
  created () {
    this.loadAllFood()
  },
  methods: {
    async loadAllFood () {
      let loadTimes = 0
      let currentPage = 1
      this.allFood.allLoaded = false
      this.allFood.loading = true
      this.allFood.loadedPagesCount = 0
      do {
        await this.$axios.$get('/food', {
          params: {
            page: currentPage
          }
        })
          .then((responseData) => {
            this.allFood.data = this.allFood.data.concat(responseData.data)
            this.allFood.allLoaded = responseData.meta.current_page >= responseData.meta.last_page
            this.allFood.loadedPagesCount++
            currentPage++
          })
      } while (this.allFood.allLoaded !== true && ++loadTimes <= this.allFood.maxLoadTimes)
      this.allFood.loading = false
    }
  }
}
