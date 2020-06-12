<template>
  <v-dialog v-model="dialog" :max-width="$vuetify.breakpoint.smAndDown ? '100%' : '600px'">
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="orange darken-2"
        dark
        grow
      >
        <v-tab :disabled="loading">
          Вход
        </v-tab>
        <v-tab :disabled="loading">
          Регистрация
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- Login -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="userData.email"
                  label="Email"
                  name="email"
                  :disabled="loading"
                  prepend-icon="mdi-account"
                  type="text"
                  :error="loginError"
                  @input="() => { loginError = false }"
                />

                <v-text-field
                  id="password"
                  v-model="userData.password"
                  label="Пароль"
                  name="password"
                  :disabled="loading"
                  prepend-icon="mdi-lock"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                dark
                color="orange darken-2"
                :loading="loading"
                @click="loginUser"
              >
                Войти
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>

        <!-- Register -->
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="userData.surname"
                  label="Фамилия"
                  name="surname"
                  :disabled="loading"
                  prepend-icon="mdi-account"
                  type="text"
                  :error="$v.userData.surname.$anyError || registerResponseErrorKeys.surname"
                  @input="() => { $v.userData.surname.$touch(); registerResponseErrorKeys.surname = false }"
                  @blur="() => { $v.userData.surname.$touch(); registerResponseErrorKeys.surname = false }"
                />

                <v-text-field
                  v-model="userData.first_name"
                  label="Имя"
                  name="first_name"
                  :disabled="loading"
                  prepend-icon="mdi-account"
                  type="text"
                  :error="$v.userData.first_name.$anyError || registerResponseErrorKeys.first_name"
                  @input="() => { $v.userData.first_name.$touch(); registerResponseErrorKeys.first_name = false }"
                  @blur="() => { $v.userData.first_name.$touch(); registerResponseErrorKeys.first_name = false }"
                />

                <v-text-field
                  v-model="userData.middle_name"
                  label="Отчество"
                  name="middle_name"
                  :disabled="loading"
                  prepend-icon="mdi-account"
                  type="text"
                  :error="$v.userData.middle_name.$anyError || registerResponseErrorKeys.middle_name"
                  @input="() => { $v.userData.middle_name.$touch(); registerResponseErrorKeys.middle_name = false }"
                  @blur="() => { $v.userData.middle_name.$touch(); registerResponseErrorKeys.middle_name = false }"
                />

                <v-text-field
                  v-model="userData.phone_number"
                  label="Номер телефона"
                  name="phone_number"
                  :disabled="loading"
                  prepend-icon="mdi-phone"
                  type="text"
                  :error="$v.userData.phone_number.$anyError || registerResponseErrorKeys.phone_number"
                  @input="() => { $v.userData.phone_number.$touch(); registerResponseErrorKeys.phone_number = false }"
                  @blur="() => { $v.userData.phone_number.$touch(); registerResponseErrorKeys.phone_number = false }"
                />

                <v-text-field
                  v-model="userData.email"
                  label="Email"
                  name="email"
                  :disabled="loading"
                  prepend-icon="mdi-at"
                  type="text"
                  :error="$v.userData.email.$anyError || registerResponseErrorKeys.email"
                  @input="() => { $v.userData.email.$touch(); registerResponseErrorKeys.email = false }"
                  @blur="() => { $v.userData.email.$touch(); registerResponseErrorKeys.email = false }"
                />

                <v-text-field
                  id="password"
                  v-model="userData.password"
                  label="Пароль"
                  name="password"
                  :disabled="loading"
                  prepend-icon="mdi-lock"
                  type="password"
                  autocomplete="new-password"
                  :error="$v.userData.password.$anyError || registerResponseErrorKeys.password"
                  @input="() => { $v.userData.password.$touch(); registerResponseErrorKeys.password = false }"
                  @blur="() => { $v.userData.password.$touch(); registerResponseErrorKeys.password = false }"
                />
                <v-text-field
                  id="password_confirmation"
                  v-model="userData.password_confirmation"
                  label="Повторите пароль"
                  name="password_confirmation"
                  :disabled="loading"
                  prepend-icon="mdi-lock"
                  type="password"
                  autocomplete="new-password"
                  :error="$v.userData.password_confirmation.$anyError || registerResponseErrorKeys.password_confirmation"
                  @input="() => { $v.userData.password_confirmation.$touch(); registerResponseErrorKeys.password_confirmation = false }"
                  @blur="() => { $v.userData.password_confirmation.$touch(); registerResponseErrorKeys.password_confirmation = false }"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                dark
                color="orange darken-2"
                :loading="loading"
                @click="registerUser"
              >
                Зарегистрироваться
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'AuthModal',
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
      tab: null,
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
      loginError: false,
      registerResponseErrorKeys: {
        surname: false,
        first_name: false,
        middle_name: false,
        phone_number: false,
        email: false,
        password: false,
        password_confirmation: false
      }
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
        required,
        minLength: minLength(8)
      },
      password_confirmation: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    loginUser () {
      this.loading = true
      this.$auth.loginWith('laravelPassportPassword', {
        data: {
          username: this.userData.email,
          password: this.userData.password
        }
      })
        .then(() => {
          // this.dialog = false
          location.reload()
        })
        .catch((error) => {
          this.loginError = true
          // eslint-disable-next-line no-console
          console.error(error)
          this.loading = false
        })
        .finally(() => {
          // this.loading = false // fixme ^ see up .then()
        })
    },
    registerUser () {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
      this.loading = true
      this.$axios.post('customer/register', {
        surname: this.userData.surname,
        first_name: this.userData.first_name,
        middle_name: this.userData.middle_name,
        phone_number: this.userData.phone_number,
        email: this.userData.email,
        password: this.userData.password,
        password_confirmation: this.userData.password_confirmation
      })
        .then((response) => {
          this.loginUser()
        })
        .catch((error) => {
          const errorResponse = error.response
          if (errorResponse.status === 422) {
            for (const key of Object.keys(errorResponse.data.errors)) {
              this.registerResponseErrorKeys[key] = true
            }
          }
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
