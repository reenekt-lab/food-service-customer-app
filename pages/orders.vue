<template>
  <v-row class="justify-center">
    <v-col>
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

      <v-toolbar dark color="orange darken-2">
        <v-btn
          icon
          nuxt
          to="/"
          class="mr-2"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>Заказы</v-toolbar-title>
        <v-spacer />
      </v-toolbar>

      <!-- new Orders -->
      <div id="new" class="headline mt-5 mb-3">
        Новые
      </div>
      <div
        v-show="newOrders.data.length === 0"
        class="title font-weight-regular mt-4 mb-2"
      >
        Новых заказов нет
      </div>
      <v-row>
        <v-col
          v-for="(newOrder, newOrderIndex) in newOrders.data"
          :key="`new-order=${newOrderIndex}`"
          :class="{
            'order-0': newOrderIndex < 2,
            'order-2': newOrderIndex >= 2
          }"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-skeleton-loader
            :loading="!allFood.allLoaded"
            type="list-item, table-heading, list-item-three-line"
          >
            <v-card
              :id="`order-${newOrder.id}`"
              :class="{
                'marked-item': allFood.allLoaded && $route.hash && $route.hash === `#order-${newOrder.id}`
              }"
            >
              <v-card-title>
                <v-spacer />
                <div
                  class="text-break"
                  :class="{
                    'flex-column': $vuetify.breakpoint.smAndDown
                  }"
                >
                  Заказ №{{ newOrder.id }}
                </div>
                <v-spacer />
              </v-card-title>
              <v-card-text
                :class="{
                  'marked-item': allFood.allLoaded && $route.hash && $route.hash === `#order-${newOrder.id}`
                }"
              >
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th style="border-bottom: none;">
                          Статус
                        </th>
                        <th style="border-bottom: none;">
                          <b>{{ getStatusName(newOrder.status) }}</b>
                        </th>
                      </tr>
                    </thead>
                  </template>
                </v-simple-table>
                <v-divider class="my-2" />
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="2">
                          Содержимое заказа
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(contentItem, contentItemIndex) in newOrder.content"
                        :key="`new-order=${newOrderIndex}-item-${contentItemIndex}`"
                      >
                        <td>{{ getFoodName(contentItem.food_id) }}</td>
                        <td>
                          <small>x</small>{{ contentItem.count }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>

                <v-simple-table dense class="mt-2">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th style="border-bottom: none;">
                          Создан
                        </th>
                        <th style="border-bottom: none;">
                          <b>{{ $moment.utc(newOrder.created_at).format('D MMM YYYY H:mm:ss') }}</b>
                        </th>
                      </tr>
                    </thead>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-skeleton-loader>
        </v-col>
        <v-col
          v-if="pwaInfo.canBeInstalled"
          v-show="!hidePwaInstallCard"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="order-1"
        >
          <v-card
            color="orange darken-2"
            dark
          >
            <v-card-title style="word-break: break-word;">
              Отслеживайте статус заказов
            </v-card-title>
            <v-card-text>
              Наше приложение всегда под рукой и не занимает много места.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
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
          </v-card>
        </v-col>
      </v-row>

      <!-- old Orders -->
      <div id="old" class="headline mt-5 mb-3">
        Прошлые заказы
      </div>
      <div
        v-show="oldOrders.data.length === 0"
        class="title font-weight-regular mt-4 mb-2"
      >
        Прошлых заказов нет
      </div>
      <v-row>
        <v-col
          v-for="(oldOrder, oldOrderIndex) in oldOrders.data"
          :key="`new-order=${oldOrderIndex}`"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-skeleton-loader
            :loading="!allFood.allLoaded"
            type="list-item, table-heading, list-item-three-line"
          >
            <v-card>
              <v-card-title>
                <v-spacer />
                <div
                  class="text-break"
                  :class="{
                    'flex-column': $vuetify.breakpoint.smAndDown
                  }"
                >
                  Заказ №{{ oldOrder.id }}
                </div>
                <v-spacer />
              </v-card-title>
              <v-card-text>
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th style="border-bottom: none;">
                          Статус
                        </th>
                        <th style="border-bottom: none;">
                          <b>{{ getStatusName(oldOrder.status) }}</b>
                        </th>
                      </tr>
                    </thead>
                  </template>
                </v-simple-table>
                <v-divider class="my-2" />
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="2">
                          Содержимое заказа
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(contentItem, contentItemIndex) in oldOrder.content"
                        :key="`new-order=${oldOrderIndex}-item-${contentItemIndex}`"
                      >
                        <td>{{ getFoodName(contentItem.food_id) }}</td>
                        <td>
                          <small>x</small>{{ contentItem.count }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>

                <v-simple-table dense class="mt-2">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th style="border-bottom: none;">
                          Создан
                        </th>
                        <th style="border-bottom: none;">
                          <b>{{ $moment.utc(oldOrder.created_at).format('D MMM YYYY H:mm:ss') }}</b>
                        </th>
                      </tr>
                    </thead>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import allFoodMixin from '../mixins/allFoodMixin'
import pwaMixin from '../mixins/pwaMixin'

export default {
  middleware: ['auth'],
  filters: {
    // todo think about it
    orderNumber (value) {
      if (!value) {
        return ''
      }
      if (value.length >= 4) {
        return value
      }
      let orderNumberString = value.toString()
      const lengthDiff = 4 - orderNumberString.length
      for (let i = 0; i < lengthDiff; i++) {
        orderNumberString = '0' + orderNumberString
      }
      return orderNumberString
    }
  },
  mixins: [allFoodMixin, pwaMixin],
  async asyncData ({ $axios, $auth }) {
    const newOrders = await $axios.$get('/order', {
      params: {
        customer: $auth.user.id,
        status: [
          'created',
          'cooking',
          'cooked',
          'delivering'
        ]
      }
    })
    const oldOrders = await $axios.$get('/order', {
      params: {
        customer: $auth.user.id,
        status: 'delivered'
      }
    })
    return {
      newOrders,
      oldOrders
    }
  },
  data () {
    return {
      snackbar: {
        active: false,
        color: 'info',
        text: ''
      },
      hidePwaInstallCard: false
    }
  },
  mounted () {
    if (this.$route.hash) {
      // if block is not loaded yet
      if (!document.querySelector(this.$route.hash)) {
        const unwatch = this.$watch('allFood.allLoaded', (val, oldVal) => {
          try {
            this.$vuetify.goTo(this.$route.hash, { offset: 50 })
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
          }
          unwatch()
        })
      } else {
        this.$vuetify.goTo(this.$route.hash, { offset: 50 })
      }
    }
  },
  methods: {
    getFoodName (id) {
      if (isNaN(id)) {
        return null
      }
      const food = this.allFood.data.find(food => food.id === +id)
      return food ? food.name : null
    },
    getStatusName (status) {
      const statusMap = {
        created: 'Создан',
        cooking: 'Готовится',
        cooked: 'Приготовлен',
        delivering: 'В доставке',
        delivered: 'Доставлен'
      }
      if (!statusMap[status]) {
        return 'Неизвестно'
      }
      return statusMap[status]
    }
  }
}
</script>

<style lang="scss">
  @import "~vuetify/src/styles/settings/colors";
  @keyframes marked-item-animation {
    from {
      background-color: map-get($orange, 'darken-2');
    }
    to {
      background-color: #ffffff;
    }
  }
  .marked-item {
    animation: marked-item-animation 1.2s ease-out .5s;
  }
</style>
