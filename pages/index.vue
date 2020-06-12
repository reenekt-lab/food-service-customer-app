<template>
  <v-container>
    <v-row v-if="pwaInfo.canBeInstalled">
      <v-col>
        <div class="d-flex align-center">
          <v-spacer />
          <div class="caption mr-3">
            Установите наше приложение
          </div>
          <v-btn
            color="orange darken-2"
            dark
            rounded
            small
            @click="$pwaInstaller.promptInstall()"
          >
            Установить
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <address-card />

    <!-- TODO make not client only -->
    <client-only>
      <v-row>
        <v-col class="common-categories d-flex justify-center">
          <v-slide-group
            v-model="selectedCategoryIndex"
            class="px-4"
            :show-arrows="showSlideArrows"
            center-active
          >
            <v-slide-item
              v-for="(category, index) in commonCategories.data"
              :key="`common-category-${index}`"
              v-slot:default="{ active, toggle }"
            >
              <common-category
                :label="category.name"
                :src="category.main_image"
                :active="active"
                @click="toggle"
              />
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>
    </client-only>

    <v-row>
      <v-col
        v-for="(restaurant, index) in restaurants.data"
        :key="`restaurant-card-${index}`"
        :cols="12"
        :sm="6"
        :md="4"
        :lg="4"
      >
        <v-card
          v-ripple
          class="mx-auto"
          height="100%"
          hover
          nuxt
          :to="{ name: 'restaurant-id', params: { id: restaurant.id } }"
        >
          <v-img
            :src="restaurant.main_image"
            height="200px"
          />

          <v-card-title>
            <v-row>
              <v-col :cols="6">
                <span class="break-word">{{ restaurant.name }}</span>
              </v-col>
              <v-col :cols="6" class="text-right">
                <span class="break-word">{{ restaurant.cooking_time }}</span>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-subtitle>
            <v-chip
              v-for="(category, category_index) in restaurant.categories"
              :key="`restaurant-${index}-category-${category_index}`"
              outlined
              class="text-default"
            >
              {{ category.name }}
            </v-chip>
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col
        v-if="!restaurants.data.length"
        cols="12"
      >
        <div class="headline text-center">
          Нет данных
        </div>
      </v-col>
    </v-row>

    <v-fade-transition>
      <v-overlay
        v-show="loading"
        opacity="0.3"
      >
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
    </v-fade-transition>
  </v-container>
</template>

<script>
import AddressCard from '../components/address/AddressCard'
import CommonCategory from '../components/categories/common/CommonCategory'
import pwaMixin from '../mixins/pwaMixin'

export default {
  components: {
    AddressCard,
    CommonCategory
  },
  mixins: [pwaMixin],
  async asyncData ({ $axios }) {
    const commonCategories = await $axios.$get('/common-category')
    const restaurants = await $axios.$get('/restaurants')
    return {
      commonCategories,
      restaurants
    }
  },
  data () {
    return {
      selectedCategoryIndex: null,
      loading: false
    }
  },
  computed: {
    selectedCategory () {
      if (this.selectedCategoryIndex === null || this.selectedCategoryIndex === undefined) {
        return null
      }
      return this.commonCategories.data[this.selectedCategoryIndex]
    },
    showSlideArrows () {
      return this.$vuetify.breakpoint.mdAndUp || false
    }
  },
  watch: {
    selectedCategory (val, oldVal) {
      this.loading = true
      const params = {}
      if (val) {
        params.common_category = val.id
      }
      this.$axios.$get('/restaurants', {
        params
      })
        .then((responseData) => {
          this.restaurants = responseData
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.break-word {
  word-break: break-word;
}
</style>
