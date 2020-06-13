<template>
  <v-simple-table>
    <thead>
      <tr v-if="!orderContent || orderContent.length === 0">
        <th
          colspan="2"
          style="border-bottom: none; text-align:center;"
        >
          Пусто
        </th>
      </tr>
      <tr v-else>
        <th>Название</th>
        <th></th>
        <th></th>
        <th v-if="!readOnly" />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(orderItem, orderItemIndex) in orderContent"
        :key="`order-content-row-${orderItemIndex}`"
      >
        <td>
          {{ getFoodName(orderItem.food_id) }}
        </td>
        <td>
          <small>x</small>{{ orderItem.count }}
        </td>
        <td class="text-no-wrap">
          <span>{{ getFoodCost(orderItem.food_id) * orderItem.count }}</span>
          <v-icon
            x-small
          >
            mdi-currency-rub
          </v-icon>
        </td>
        <td v-if="!readOnly">
          <v-btn
            icon
            color="error"
            @click="removeOrderItem(orderItem)"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </td>
      </tr>
      <tr v-if="orderContent.length" class="font-weight-bold">
        <td colspan="2">
          <span>Итого</span>
        </td>
        <td colspan="2" class="text-no-wrap">
          <span>{{ orderContentTotalCost }}</span>
          <v-icon
            x-small
          >
            mdi-currency-rub
          </v-icon>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
export default {
  name: 'CartContentTable',
  props: {
    orderContent: {
      required: true,
      type: Array
    },
    allFood: {
      required: true,
      type: Object
    },
    readOnly: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    orderContentTotalCost () {
      if (!this.orderContent || !this.orderContent.length) {
        return 0
      }

      let totalCost = 0
      for (const key in this.orderContent) {
        const orderItem = this.orderContent[key]
        totalCost += +this.getFoodCost(orderItem.food_id) * orderItem.count
      }

      return totalCost
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
    getFoodCost (id) {
      if (isNaN(id)) {
        return null
      }
      const food = this.allFood.data.find(food => food.id === +id)
      return food ? +food.cost : null
    },
    removeOrderItem (orderItem) {
      this.$emit('order-content:remove-item', orderItem)
    }
  }
}
</script>

<style scoped>

</style>
