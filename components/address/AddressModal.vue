<template>
  <v-dialog v-model="dialog" :max-width="$vuetify.breakpoint.smAndDown ? '100%' : '600px'">
    <v-card>
      <v-card-title>
        Введите адрес
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="addressMirror"
          label="Адрес"
          placeholder="Адрес доставки"
          required
          outlined
          hint="Ваш заказ будет доставлен на этот адрес"
          persistent-hint
          :error="$v.addressMirror.$anyError"
          @input="$v.addressMirror.$touch()"
          @blur="$v.addressMirror.$touch()"
        />
        <v-btn
          color="orange darken-2"
          dark
          :block="$vuetify.breakpoint.smAndDown"
          @click="saveAndClose"
        >
          OK
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'AddressModal',
  mixins: [validationMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  data () {
    return {
      addressMirror: ''
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
    },
    address: {
      get () {
        return this.$store.state.address.address
      }
      // set (value) {
      //   this.addressMirror = value
      //   this.$v.$touch()
      //   if (!this.$v.$anyError) {
      //     this.$store.commit('address/set', value)
      //   }
      // }
    }
  },
  validations: {
    addressMirror: {
      required,
      minLength: minLength(5)
    }
  },
  created () {
    const unwatch = this.$watch('address', (val, oldVal) => {
      this.addressMirror = val
      unwatch()
    })
  },
  mounted () {
    this.addressMirror = this.address
  },
  methods: {
    saveAndClose () {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
      this.$store.commit('address/set', this.addressMirror)
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
