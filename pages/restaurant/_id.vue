<template>
  <div
    :style="{
      'padding-top': secondaryAppBarHeight
    }"
  >
    <v-snackbar
      v-model="snackbar.active"
      top
      multi-line
      :color="snackbar.color"
    >
      {{ snackbar.text }}
      <v-btn
        dark
        text
        @click="snackbar.active = false"
      >
        Закрыть
      </v-btn>
    </v-snackbar>

    <v-app-bar
      v-show="shouldShowAppBar"
      ref="secondaryAppBar"
      :color="`${secondaryAppBarColor} lighten-2`"
      :src="restaurant.main_image"
      fade-img-on-scroll
      dark
      shrink-on-scroll
      prominent
      fixed
      :style="{
        'top': $vuetify.breakpoint.smAndDown ? '56px' : '64px'
      }"
      height="200"
    >
      <v-btn
        icon
        nuxt
        to="/"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Title</v-toolbar-title>

      <v-spacer />

      <v-btn
        icon
        @click="restaurantInfoModalActive = true"
      >
        <v-icon>mdi-information-variant</v-icon>
      </v-btn>

      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(0,0,0,.27), rgba(0,0,0,.27)"
        />
      </template>

      <template v-slot:extension>
        <v-tabs
          class="categories-tabs"
          :value="tabsValue"
        >
          <v-tab
            v-for="(category, categoryIndex) in categories"
            :key="`tab-category-${categoryIndex}`"
            @click="$vuetify.goTo(`#food-category-title-${category.id}`, { offset: 108 * $vuetify.breakpoint.smAndDown })"
          >
            {{ category.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-container fluid class="px-0">
      <v-row>
        <v-col
          cols="12"
          md="7"
          lg="8"
        >
          <v-toolbar
            v-show="shouldShowToolbar"
            prominent
            extended
            :color="`${secondaryAppBarColor} lighten-2`"
            :src="restaurant.main_image"
            dark
            height="200"
          >
            <v-btn
              icon
              nuxt
              to="/"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title>{{ restaurant.name }}</v-toolbar-title>

            <v-spacer />

            <v-btn
              icon
              @click="restaurantInfoModalActive = true"
            >
              <v-icon>mdi-information-variant</v-icon>
            </v-btn>

            <template v-slot:img="{ props }">
              <v-img
                v-bind="props"
                gradient="to top right, rgba(0,0,0,.27), rgba(0,0,0,.27)"
              />
            </template>

            <template v-slot:extension>
              <v-tabs
                :value="tabsValue"
                show-arrows
              >
                <v-tab
                  v-for="(category, categoryIndex) in categories"
                  :key="`tab-category-${categoryIndex}`"
                  @click="$vuetify.goTo(`#food-category-title-${category.id}`, { offset: 108 * $vuetify.breakpoint.smAndDown })"
                >
                  {{ category.name }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <!-- todo revert flex-column-reverse -> flex-column AND `'order-0': foodGroupIndex < 2` -->
          <v-container fluid class="px-0 d-flex flex-column-reverse">
            <v-row
              v-for="(foodGroup, foodGroupCategoryId, foodGroupIndex) in groupedFood"
              :key="`food-group-${foodGroupIndex}`"
              v-intersect="{
                handler: onIntersect,
                options: {
                  root: null,
                  rootMargin: '-160px 0px -40% 0px'
                }
              }"
              :class="{
                'order-0': foodGroupIndex < (Object.keys(groupedFood).length - 3),
                'order-2': foodGroupIndex >= (Object.keys(groupedFood).length - 3)
              }"
              :data-category-id="categories.find(value => value.id === +foodGroupCategoryId).id"
              :data-category-index="foodGroupIndex"
            >
              <div
                :id="`food-category-title-${categories.find(value => value.id === +foodGroupCategoryId).id}`"

                class="text-h4 mb-3 mt-2 px-3 food-category-title"
              >
                {{ categories.find(value => value.id === +foodGroupCategoryId).name }}
              </div>

              <v-col
                v-for="(food, foodIndex) in foodGroup"
                :key="`food-${foodIndex}`"
                cols="12"
                sm="6"
                lg="4"
                xl="3"
              >
                <v-card
                  v-ripple
                  hover
                  height="100%"
                  @click="addToCart(food)"
                >
                  <v-img
                    :src="food.main_image"
                    height="200px"
                  />

                  <v-card-title>{{ food.name }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <client-only>
              <v-row
                v-if="pwaInfo.canBeInstalled"
                v-show="!hidePwaInstallCard"
                class="order-1"
              >
                <v-col>
                  <v-card
                    class="d-flex flex-no-wrap justify-space-between"
                    color="orange darken-2"
                    dark
                  >
                    <div>
                      <v-card-title>
                        Оффлайн каталог
                      </v-card-title>
                      <v-card-text>
                        В нашем маленьком и быстром приложении вы можете найти вкусное блюдо даже оффлайн
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          color="white"
                          light
                          @click="$pwaInstaller.promptInstall()"
                        >
                          Установить
                        </v-btn>
                        <v-btn
                          text
                          color="white"
                          @click="hidePwaInstallCard = true"
                        >
                          Нет, спасибо
                        </v-btn>
                      </v-card-actions>
                    </div>
                    <v-avatar
                      v-show="$vuetify.breakpoint.smAndUp"
                      class="ma-3 align-self-center"
                      size="125"
                      tile
                    >
                      <v-img
                        :src="require('../../static/icon.png')"
                      ></v-img>
                    </v-avatar>
                  </v-card>
                </v-col>
              </v-row>
            </client-only>
          </v-container>
        </v-col>
        <v-col
          v-show="$vuetify.breakpoint.mdAndUp"
          cols="12"
          md="5"
          lg="4"
        >
          <v-card class="floating-card">
            <v-card-title>Заказ</v-card-title>
            <v-card-text>
              <cart-content-table
                :all-food="allFood"
                :order-content="order.content"
                @order-content:remove-item="removeOrderContentItem"
              />
              <v-divider
                v-if="$store.state.address.address"
                class="my-3"
                inset
              />
              <v-hover #default="{ hover }">
                <div
                  v-if="$store.state.address.address"
                  style="cursor:pointer;"
                  @click="$root.$emit('require.modal:address')"
                >
                  <div>
                    <span>Адрес доставки</span>
                    <v-fade-transition>
                      <v-icon v-show="hover" small>
                        mdi-square-edit-outline
                      </v-icon>
                    </v-fade-transition>
                  </div>
                  <div class="headline text--primary">
                    {{ $store.state.address.address }}
                  </div>
                </div>

                <!-- fixes v-hoer warn when address is not defined -->
                <div v-else />
              </v-hover>
              <v-alert
                v-show="order.content.length > 0"
                type="warning"
                icon="mdi-alert-circle"
                border="left"
                dense
              >
                Оплата заказа производится при получении!
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                v-show="order.content.length > 0"
                :disabled="order.content.length <= 0"
                class="mb-2"
                color="orange darken-2"
                dark
                :loading="loading"
                @click="sendOrder"
              >
                Отправить заказ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-footer
      v-show="$vuetify.breakpoint.smAndDown && order.content.length"
      app
      padless
      color="orange darken-2"
      style="z-index: 4;"
    >
      <v-container>
        <v-row>
          <v-col
            class="d-flex py-0"
            cols="12"
          >
            <v-spacer />
            <v-bottom-sheet
              v-model="cartBottomSheetActive"
              persistent
              fullscreen
              scrollable
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  block
                  text
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-badge
                    :content="order.content.length"
                    color="success"
                  >
                    <v-icon>mdi-shopping-outline</v-icon>
                  </v-badge>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span>Заказ</span>
                  <v-spacer />
                  <v-btn
                    icon
                    color="secondary"
                    @click="cartBottomSheetActive = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <cart-content-table
                    :all-food="allFood"
                    :order-content="order.content"
                    @order-content:remove-item="removeOrderContentItem"
                  />
                  <v-divider class="my-3" inset />
                  <div
                    v-if="$store.state.address.address"
                    @click="$root.$emit('require.modal:address')"
                  >
                    <div>
                      <span>Адрес доставки</span>
                      <v-icon small>
                        mdi-square-edit-outline
                      </v-icon>
                    </div>
                    <div class="headline text--primary">
                      {{ $store.state.address.address }}
                    </div>
                  </div>
                  <v-alert
                    v-show="order.content.length > 0"
                    type="warning"
                    icon="mdi-alert-circle"
                    border="left"
                    dense
                  >
                    Оплата заказа производится при получении!
                  </v-alert>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    class="mb-2"
                    color="orange darken-2"
                    dark
                    block
                    :loading="loading"
                    @click="sendOrder"
                  >
                    Отправить заказ
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-bottom-sheet>
            <v-spacer />
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <add-to-cart-modal
      v-model="addToCartModalActive"
      :cart.sync="order.content"
      :food="selectedFood"
    />
    <restaurant-info-modal
      v-model="restaurantInfoModalActive"
      :restaurant="restaurant"
    />

    <v-fade-transition>
      <v-overlay
        v-show="loading"
        opacity="0.3"
      >
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
    </v-fade-transition>
  </div>
</template>

<script>
import AddToCartModal from '../../components/cart/AddToCartModal'
import RestaurantInfoModal from '../../components/restaurant/RestaurantInfoModal'
import CartContentTable from '../../components/cart/CartContentTable'
import allFoodMixin from '../../mixins/allFoodMixin'
import pwaMixin from '../../mixins/pwaMixin'

export default {
  components: {
    AddToCartModal, CartContentTable, RestaurantInfoModal
  },
  mixins: [allFoodMixin, pwaMixin],
  async asyncData ({ params, $axios, redirect }) {
    if (!params.id) {
      redirect('/')
    }
    const restaurant = (await $axios.$get(`/restaurants/${params.id}`)).data
    const foodRawData = await $axios.$get('/food', {
      params: {
        restaurant: params.id,
        group_by_category: true
      }
    })
    const groupedFood = foodRawData.data.groupedFood
    const categories = foodRawData.data.categories

    const selectedFood = groupedFood[Object.keys(groupedFood)[0]][0]

    return {
      restaurant,
      groupedFood,
      categories,
      selectedFood
    }
  },
  data () {
    return {
      secondaryAppBarColor: 'orange darken-2',
      order: {
        content: []
      },
      addToCartModalActive: false,
      restaurantInfoModalActive: false,
      cartBottomSheetActive: false,
      tabsValue: 0,
      categoryTitlesIntersectionsIds: [],
      loading: false,
      snackbar: {
        active: false,
        color: 'info',
        text: ''
      },

      hidePwaInstallCard: false,

      pageMounted: false // fixme
    }
  },
  computed: {
    secondaryAppBarHeight () {
      if (!this.pageMounted) {
        return '296px' // fixme
      }

      if (this.$vuetify.breakpoint.smAndDown && this.$refs.secondaryAppBar) {
        return getComputedStyle(this.$refs.secondaryAppBar.$el).height
      }
      if (this.$vuetify.breakpoint.smAndDown && !this.$refs.secondaryAppBar) {
        return '296px' // fixme
      }

      return '0px'
    },
    shouldShowAppBar () {
      return this.$vuetify.breakpoint.smAndDown
    },
    shouldShowToolbar () {
      return this.$vuetify.breakpoint.mdAndUp
    }
  },
  mounted () {
    this.pageMounted = true
    this.$root.$emit('fix:footer')
  },
  methods: {
    onIntersect (entries, observer, isIntersecting) {
      const categoryIndex = +entries[0].target.dataset.categoryIndex
      if (isIntersecting) {
        if (!this.categoryTitlesIntersectionsIds.includes(categoryIndex)) {
          this.categoryTitlesIntersectionsIds.push(categoryIndex)
        }
        if (this.categoryTitlesIntersectionsIds.length) {
          this.tabsValue = Math.min(...this.categoryTitlesIntersectionsIds)
        }
      } else {
        this.categoryTitlesIntersectionsIds = this.categoryTitlesIntersectionsIds.filter(value => value !== categoryIndex)
        if (this.categoryTitlesIntersectionsIds.length) {
          this.tabsValue = Math.min(...this.categoryTitlesIntersectionsIds)
        }
      }
    },
    addToCart (food) {
      if (!this.$auth.loggedIn) {
        this.$root.$emit('require.modal:auth')
        return
      }
      if (!this.$store.state.address.address) {
        this.$root.$emit('require.modal:address')
        return
      }
      this.selectedFood = food
      this.addToCartModalActive = true
    },
    removeOrderContentItem (item) {
      const itemIndex = this.order.content.indexOf(item)
      if (itemIndex !== -1) {
        this.order.content.splice(itemIndex, 1)
      }
    },
    sendOrder () {
      this.loading = true
      this.$axios.post('/order', {
        customer_id: this.$auth.user.id,
        content: this.order.content,
        restaurant_id: this.restaurant.id,
        address: this.$store.state.address.address
      })
        .then((response) => {
          let hash = '#new'
          if (response.data.order && response.data.order.id) {
            hash = `#order-${response.data.order.id}`
          }
          this.$router.push({ name: 'orders', hash })
        })
        .catch(() => {
          this.snackbar.color = 'error'
          this.snackbar.active = true
          this.snackbar.text = 'Произошла ошибка'
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.categories-tabs::v-deep {
  .v-slide-group__prev, .v-slide-group__next {
    display: none !important;
  }
}
.food-category-title {
  width: 100%;
}
.floating-card {
  position: sticky;
  top: 80px;
}
</style>
