export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: 'static',
  mode: 'history',
  env: {
    base_url: 'https://restcountries.eu/rest/v2/',
  },
  router: {
    base: '/countries/',
  },
  // generate: {
  //   fallback: 'index.html',
  // },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'countries',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?' }],
    script: [
      {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
        integrity:
          'sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM',
        crossorigin: 'anonymous',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/node_modules/bootstrap/dist/css/bootstrap.css',
    '@assets/style.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@plugins/bootstrap.js', '@plugins/index.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/color-mode',
    [
      '@nuxtjs/eslint-module',
      {
        fix: true,
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/google-fonts',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
  ],
  googleFonts: {
    download: true,
    base64: true,
    inject: true,
    families: {
      'Nunito+Sans': true,
    },
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  // axios: {
  //   baseURL: 'https://api.github.com',
  //   proxyHeaders: false,
  //   credentials: false,
  // },

  // proxy: {
  //   '/api/': {
  //     target: 'http://restcountries.eu/rest/v2/',
  //     pathRewrite: { '^/api/': '' },
  //     changeOrigin: true,
  //   },
  // },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['jquery', 'bootstrap'],
  },
}
