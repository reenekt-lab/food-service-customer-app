import colors from 'vuetify/es5/util/colors'
require('dotenv').config() // load env for true app configuration (axios and other) FIXME https://github.com/nuxt-community/axios-module/issues/171#issuecomment-542261530

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: colors.blue.darken2 },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/page-transition.css',
    '~/assets/fonts.css',
    '@mdi/font/css/materialdesignicons.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vuex-localstorage.js', ssr: false },
    { src: '~plugins/pwa-installer', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    // Doc: https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://auth.nuxtjs.org/
    // '@nuxtjs/auth'
    '@nuxtjs/auth-next'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },

  /*
  ** Auth module configuration
  ** See https://auth.nuxtjs.org/api/options.html
  */
  auth: {
    redirect: {
      login: '/'
    },
    strategies: {
      laravelPassportPasswordGrant: {
        name: 'laravelPassportPassword',
        provider: 'laravel/passport',
        url: process.env.AUTH_BASE_URL || 'http://food-service.local',
        endpoints: {
          user: {
            url: process.env.AUTH_USER_ENDPOINT || '/api/auth/user'
          }
        },
        token: {
          maxAge: 1800
        },
        refreshToken: {
          maxAge: 60 * 60 * 24 * 30
        },
        clientId: process.env.AUTH_PASSPORT_CLIENT_ID,
        clientSecret: process.env.AUTH_PASSPORT_CLIENT_SECRET,
        grantType: 'password'
      }
    }
  },
  /*
  ** PWA module configuration
  ** See https://pwa.nuxtjs.org/
  */
  pwa: {
    manifest: {
      name: 'Заказ еды Food Service',
      short_name: 'Заказ еды',
      description: 'Заказ еды с доставкой',
      theme_color: colors.orange.darken1,
      lang: 'ru'
    }
  },

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    defaultAssets: false,
    optionsPath: './vuetify.options.js'
  },

  moment: {
    defaultLocale: 'ru',
    locales: ['ru']
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
