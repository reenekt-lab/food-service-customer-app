<template>
  <v-card :elevation="6">
    <v-img
      class="white--text align-center"
      :height="$vuetify.breakpoint.xsOnly ? '200px' : '300px'"
      :src="imageURL"
      position="center top"
    >
      <v-container>
        <v-row>
          <v-col cols="12" sm="7">
            <!-- Desktop -->
            <v-card-title class="text-h3 d-none d-sm-block break-word">
              Быстрая доставка еды
            </v-card-title>

            <div class="ml-4 mt-8 address-input-wrapper d-none d-md-flex">
              <v-text-field
                :value="address"
                label="Адрес"
                placeholder="Введите адрес доставки"
                required
                solo
                @input="addressInputHandler"
              />
              <v-btn color="orange darken-2" dark large height="48px" @click="saveAddress">
                Сохранить адрес
              </v-btn>
            </div>

            <!-- Mobile -->
            <v-card-title class="title d-sm-none break-word">
              Доставка еды
            </v-card-title>
          </v-col>
        </v-row>
        <v-row class="d-flex d-md-none justify-center">
          <v-col cols="9">
            <!-- Mobile dialog -->
            <v-dialog
              v-model="dialogActive"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  rounded
                  block
                  large
                  color="orange darken-2"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  Указать адрес
                </v-btn>
              </template>

              <v-card>
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >
                  Укажиете адрес
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          :value="address"
                          label="Адрес"
                          placeholder="Адрес доставки"
                          required
                          solo
                          hint="Ваш заказ будет доставлен на этот адрес"
                          persistent-hint
                          @input="addressInputHandler"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-divider />

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="orange darken-2"
                    text
                    dark
                    large
                    height="48px"
                    @click="saveAddress"
                  >
                    Сохранить
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: 'AddressCard',
  data () {
    return {
      imageURL: require('./assets/images/card-bg.jpg'),
      temporaryAddress: '',
      dialogActive: false
    }
  },
  computed: {
    address () {
      return this.$store.state.address.address
    }
  },
  methods: {
    addressInputHandler (value) {
      this.temporaryAddress = value
    },
    saveAddress () {
      if (this.temporaryAddress.length > 0) {
        this.$store.commit('address/set', this.temporaryAddress)
      }
      if (this.dialogActive === true) {
        this.dialogActive = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.address-input-wrapper {
  & > * {
    &:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
.break-word {
  word-break: break-word;
}
</style>
