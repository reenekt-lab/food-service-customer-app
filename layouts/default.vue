<template>
  <v-app dark>
    <!-- eslint-disable -->
<!--    <v-navigation-drawer-->
<!--      v-model="drawer"-->
<!--      :mini-variant="miniVariant"-->
<!--      :clipped="clipped"-->
<!--      fixed-->
<!--      app-->
<!--    >-->
<!--      <v-list>-->
<!--        <v-list-item-->
<!--          v-for="(item, i) in items"-->
<!--          :key="i"-->
<!--          :to="item.to"-->
<!--          router-->
<!--          exact-->
<!--        >-->
<!--          <v-list-item-action>-->
<!--            <v-icon>{{ item.icon }}</v-icon>-->
<!--          </v-list-item-action>-->
<!--          <v-list-item-content>-->
<!--            <v-list-item-title v-text="item.title" />-->
<!--          </v-list-item-content>-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--    </v-navigation-drawer>-->
    <!-- eslint-enable -->

    <v-app-bar
      ref="appBar"
      :clipped-left="clipped"
      elevate-on-scroll
      color="white"
      app
    >
      <v-container class="d-flex align-center">
        <!-- eslint-disable -->
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" />-->
        <!-- <v-toolbar-title v-text="title" />-->
        <!-- eslint-enable -->
        <v-toolbar-title class="d-flex">
          <div
            style="cursor:pointer;"
            @click="$router.push('/')"
          >
            {{ title }} <span class="demo-span">DEMO</span>
          </div>
        </v-toolbar-title>
        <v-spacer />

        <v-btn
          icon
          color="secondary"
          @click="userDrawerToggleHandler"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-navigation-drawer
      v-model="rightDrawer"
      :touchless="rightDrawerDisabled"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <client-only>
              <v-list-item-title v-if="$auth.loggedIn" class="headline">
                {{ $auth.user.first_name }}
              </v-list-item-title>
            </client-only>
          </v-list-item-content>
          <v-list-item-icon>
            <v-btn
              icon
              color="secondary"
              large
              @click.stop="rightDrawer = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          nuxt
          :to="{ name: 'orders' }"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-food
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Мои заказы
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          nuxt
          :to="{ name: 'profile' }"
        >
          <v-list-item-icon>
            <v-icon>
              mdi-account-circle
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            Профиль
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <v-list class="pb-0">
          <v-list-item
            class="logout-list-item"
            @click="$auth.logout()"
          >
            <v-list-item-title class="text-center">
              Выход
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-footer
      :app="footerAppProp"
      :absolute="true"
    >
      <v-container>
        <v-row>
          <v-col :cols="12">
            <div class="pb-3 text--secondary">
              <div class="headline">
                {{ title }} <span class="demo-span-footer">DEMO</span>
              </div>
              <v-divider class="my-4" />
              <v-row>
                <v-col cols="12" md="4" class="footer-links">
                  <a :href="linkToRestaurantManagerApp ? linkToRestaurantManagerApp : '#'" class="text--secondary d-block">Для ресторанов</a>
                  <a :href="linkToCourierApp ? linkToCourierApp : '#'" class="text--secondary d-block">Для курьеров</a>
                </v-col>
              </v-row>
              <v-divider class="my-5" />
              <div class="d-flex justify-space-between">
                <!-- eslint-disable-next-line -->
                <!--              <span>&copy; {{ new Date().getFullYear() }} {{ title }}</span>-->
                <span>&copy; {{ new Date().getFullYear() }} Андрей Семенцов</span>
                <span>Разработал <a class="text--secondary" target="_blank" href="https://github.com/reenekt">Андрей Семенцов</a></span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <auth-modal
      v-model="authModalActive"
    />
    <address-modal
      v-model="addressModalActive"
    />
  </v-app>
</template>

<script>
import AuthModal from '../components/auth-modal/AuthModal'
import AddressModal from '../components/address/AddressModal'
import pwaMixin from '../mixins/pwaMixin'

export default {
  components: {
    AuthModal, AddressModal
  },
  mixins: [pwaMixin],
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Главная',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      rightDrawerDisabled: false,
      authModalActive: false,
      addressModalActive: false,
      title: process.env.APP_NAME,
      linkToRestaurantManagerApp: process.env.APP_LINK_TO_RESTAURANT_MANAGER_APP,
      linkToCourierApp: process.env.APP_LINK_TO_COURIER_APP,

      footerAppProp: true // fixme: works wrong when open restaurant page from any other page
    }
  },
  mounted () {
    this.$root.$on('fix:footer', () => {
      this.footerAppProp = false
      setTimeout(() => {
        this.footerAppProp = true
      }, 50)
    })

    this.$root.$on('require.modal:auth', () => {
      this.authModalActive = true
    })
    this.$root.$on('require.modal:address', () => {
      this.addressModalActive = true
    })

    if (!this.$auth.loggedIn) {
      this.rightDrawerDisabled = true
    }
  },
  methods: {
    userDrawerToggleHandler () {
      if (!this.$auth.loggedIn) {
        this.showAuthModal()
      } else {
        this.rightDrawerToggle(true)
      }
    },
    rightDrawerToggle (value = null) {
      if (value !== null) {
        this.rightDrawer = value
      } else {
        this.rightDrawer = !this.rightDrawer
      }
    },
    showAuthModal () {
      this.authModalActive = true
    }
  }
}
</script>
<style scoped lang="scss">
.demo-span {
  color: #ff0000;
  font-size: 12px;
  vertical-align: text-top;

  &-footer {
    color: rgba(210, 0, 0, 0.8);
    font-size: 12px;
    vertical-align: .85em;
  }
}

.footer-links a {
  color: rgba(0, 0, 0, 0.6) !important;
  text-decoration: none;

  &:not(:last-child) {
    margin-bottom: .625em;
  }
}

.logout-list-item {
  &.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    @import "~vuetify/src/styles/settings/colors";
    color: map-get($red, 'accent-2') !important;
  }
}
</style>
