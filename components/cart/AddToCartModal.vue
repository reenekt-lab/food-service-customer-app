<template>
  <v-dialog v-model="dialog" :max-width="$vuetify.breakpoint.smAndDown ? '100%' : '600px'">
    <v-card
      height="100%"
    >
      <v-img
        :src="food.main_image"
        height="200px"
      />

      <v-card-title>
        <div>{{ food.name }}</div>
        <v-spacer />
        <div>
          {{ food.cost * count }}
          <v-icon
            small
          >
            mdi-currency-rub
          </v-icon>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="text-truncate" style="max-height: 250px;">
          {{ food.description }}
        </div>
        <v-text-field
          v-model="count"
          class="add-to-cart__count-field"
          prepend-inner-icon="mdi-minus"
          append-icon="mdi-plus"
          type="number"
          min="1"
          max="100"
          step="1"
          :error="$v.count.$anyError"
          @input="$v.count.$touch()"
          @blur="$v.count.$touch()"
          @click:prepend-inner="() => { if (count > 1) { count-- } }"
          @click:append="() => { if (count < 100) { count++ } }"
        />

        <div class="d-flex">
          <v-spacer />
          <v-btn
            color="orange darken-2"
            dark
            :block="$vuetify.breakpoint.smAndDown"
            :disabled="$v.count.$anyError"
            @click="addToCart"
          >
            Добавить в заказ
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minValue, integer } from 'vuelidate/lib/validators'
const loadshCloneDeep = require('lodash.clonedeep')

export default {
  name: 'AddToCartModal',
  mixins: [validationMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true,
      type: Boolean
    },
    food: {
      required: true,
      type: Object
    },
    // should be used with .sync modifier
    cart: {
      required: true,
      type: Array
    }
  },
  data () {
    const cartLocal = loadshCloneDeep(this.cart)
    return {
      count: 1,
      cartLocal
    }
  },
  computed: {
    dialog: {
      get () {
        return !!this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  },
  validations: {
    count: {
      required,
      minValue: minValue(1),
      integer
    }
  },
  methods: {
    addToCart () {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
      // todo add check if same food_id exists in this.cartLocal
      this.cartLocal.push({
        food_id: this.food.id,
        count: this.count
      })
      this.$emit('update:cart', this.cartLocal)
      this.dialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.add-to-cart {
  &__count-field {
    ::v-deep.v-input__control {
      .v-input__slot {
        .v-text-field__slot {
          input {
            text-align: center;
            -webkit-appearance: none;

            // https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
            /* Chrome, Safari, Edge, Opera */
            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            /* Firefox */
            &[type=number] {
              -moz-appearance: textfield;
            }
          }
        }
      }
    }
  }
}
</style>
