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
        <th>Количество</th>
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
          {{ orderItem.count }}
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
  methods: {
    getFoodName (id) {
      if (isNaN(id)) {
        return null
      }
      const food = this.allFood.data.find(food => food.id === +id)
      return food ? food.name : null
    },
    removeOrderItem (orderItem) {
      this.$emit('order-content:remove-item', orderItem)
    }
  }
}
</script>

<style scoped>

</style>
