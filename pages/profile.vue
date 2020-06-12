<template>
  <v-row class="justify-center">
    <v-col
      cols="12"
      md="10"
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

      <v-card>
        <v-card-title
          class="display-1"
        >
          <v-btn
            icon
            nuxt
            to="/"
            class="mr-2 order-0"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div
            class="d-flex text-break order-3 order-md-1"
            :class="{
              'flex-column': $vuetify.breakpoint.smAndDown
            }"
          >
            <span>{{ $auth.user.surname }}&nbsp;</span>
            <span>{{ $auth.user.first_name }}&nbsp;</span>
            <span>{{ $auth.user.middle_name }}</span>
          </div>
          <v-spacer class="order-1 order-md-2" />
          <v-btn
            icon
            color="secondary"
            class="order-2 order-md-3"
            @click="editMode = !editMode"
          >
            <v-icon v-if="!editMode">
              mdi-account-edit
            </v-icon>
            <v-icon v-else>
              mdi-account-edit-outline
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              v-model="userData.surname"
              label="Фамилия"
              name="surname"
              :disabled="loading || !editMode"
              prepend-icon="mdi-account"
              type="text"
              :error="$v.userData.surname.$anyError"
              @input="$v.userData.surname.$touch()"
              @blur="$v.userData.surname.$touch()"
            />

            <v-text-field
              v-model="userData.first_name"
              label="Имя"
              name="first_name"
              :disabled="loading || !editMode"
              prepend-icon="mdi-account"
              type="text"
              :error="$v.userData.first_name.$anyError"
              @input="$v.userData.first_name.$touch()"
              @blur="$v.userData.first_name.$touch()"
            />

            <v-text-field
              v-model="userData.middle_name"
              label="Отчество"
              name="middle_name"
              :disabled="loading || !editMode"
              prepend-icon="mdi-account"
              type="text"
              :error="$v.userData.middle_name.$anyError"
              @input="$v.userData.middle_name.$touch()"
              @blur="$v.userData.middle_name.$touch()"
            />

            <v-text-field
              v-model="userData.phone_number"
              label="Номер телефона"
              name="phone_number"
              :disabled="loading || !editMode"
              prepend-icon="mdi-phone"
              type="text"
              :error="$v.userData.phone_number.$anyError"
              @input="$v.userData.phone_number.$touch()"
              @blur="$v.userData.phone_number.$touch()"
            />

            <v-text-field
              v-model="userData.email"
              label="Email"
              name="email"
              :disabled="loading || !editMode"
              prepend-icon="mdi-at"
              type="text"
              :error="$v.userData.email.$anyError"
              @input="$v.userData.email.$touch()"
              @blur="$v.userData.email.$touch()"
            />

            <v-text-field
              id="password"
              v-model="userData.password"
              label="Пароль"
              name="password"
              :disabled="loading || !editMode"
              prepend-icon="mdi-lock"
              type="password"
              autocomplete="new-password"
              :error="$v.userData.password.$anyError"
              @input="$v.userData.password.$touch()"
              @blur="$v.userData.password.$touch()"
            />
            <v-text-field
              id="password_confirmation"
              v-model="userData.password_confirmation"
              label="Повторите пароль"
              name="password_confirmation"
              :disabled="loading || !editMode"
              prepend-icon="mdi-lock"
              type="password"
              autocomplete="new-password"
              :error="$v.userData.password_confirmation.$anyError"
              @input="$v.userData.password_confirmation.$touch()"
              @blur="$v.userData.password_confirmation.$touch()"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-show="editMode"
            dark
            color="orange darken-2"
            :block="$vuetify.breakpoint.smAndDown"
            :loading="loading"
            @click="updateProfile"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  middleware: ['auth'],
  mixins: [validationMixin],
  data () {
    return {
      userData: {
        surname: '',
        first_name: '',
        middle_name: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false,
      editMode: false,
      snackbar: {
        active: false,
        color: 'info',
        text: ''
      }
    }
  },
  created () {
    this.prepareUserData()
  },
  validations: {
    userData: {
      surname: {
        required
      },
      first_name: {
        required
      },
      middle_name: {
        required
      },
      phone_number: {
        required
      },
      email: {
        required
      },
      password: {
        minLength: minLength(8)
      },
      password_confirmation: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    prepareUserData () {
      const userData = this.userData
      for (const key in this.$auth.user) {
        if (Object.prototype.hasOwnProperty.call(this.$auth.user, key)) {
          userData[key] = this.$auth.user[key]
        }
      }
      this.userData = Object.assign({}, userData)
    },
    updateProfile () {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      this.loading = true

      const data = {
        _method: 'PUT',
        surname: this.userData.surname,
        first_name: this.userData.first_name,
        middle_name: this.userData.middle_name,
        phone_number: this.userData.phone_number,
        email: this.userData.email
      }
      if (this.userData.password) {
        data.password = this.userData.password
        data.password_confirmation = this.userData.password_confirmation
      }

      this.$axios.post(`/customer/${this.$auth.user.id}`, data)
        .then((response) => {
          this.snackbar.color = 'success'
          this.snackbar.active = true
          // this.snackbar.text = response.data.message
          this.snackbar.text = 'Данные профиля обновлены'
          this.$auth.fetchUser() // fixme dont work
          location.reload()
          //   .then((response) => {
          //     console.log(response.data)
          //     console.log(this.$auth.$state)
          //   })
          // this.$router.push(this.$route.fullPath)
        })
        .catch((error) => {
          this.snackbar.color = 'error'
          this.snackbar.active = true
          // this.snackbar.text = error.response.data.message
          this.snackbar.text = Object.entries(error.response.data.errors)[0][1][0]
        })
        .finally(() => {
          // this.loading = false // fixme see (.then() ^ )
        })
    }
  }
}
</script>

<style scoped>

</style>
