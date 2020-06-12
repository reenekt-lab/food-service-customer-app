<template>
  <v-dialog v-model="dialog" :max-width="$vuetify.breakpoint.smAndDown ? '100%' : '600px'">
    <v-card
      height="100%"
    >
      <v-img
        :src="restaurant.main_image"
        height="200px"
      >
        <v-container>
          <v-row>
            <v-col class="pt-0">
              <div class="d-flex">
                <v-spacer />
                <v-btn
                  icon
                  color="secondary"
                  @click="dialog = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-img>

      <v-card-title>
        <span>{{ restaurant.name }}</span>
        <v-spacer />
      </v-card-title>
      <v-card-subtitle>{{ restaurant.address }}</v-card-subtitle>
      <v-card-text>
        {{ restaurant.description }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RestaurantInfoModal',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true,
      type: Boolean
    },
    restaurant: {
      required: true,
      type: Object
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
  }
}
</script>

<style scoped>

</style>
