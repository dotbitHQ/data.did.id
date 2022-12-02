import abcConfig from './abc.config'
import { resolve } from 'path'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,
  target: 'server',
  srcDir: 'src/',
  server: {
    host: abcConfig.host,
    port: abcConfig.port
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '.bit - Web3 identities for you and your community.',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: '.bit is a blockchain-based, decentralized and open sourced account system. It is the first account system with broad compatibility and complete ownership and control by users. .bit can be used as a cryptocurrency collection account, as a domain name, or as an account for accessing general Internet services.' },
      { hid: 'keyword', name: 'keywords', content: '.bit, dotbit, did, .bit did, .bit domain, web3 domains, .bit web3, crypto domain, domain crypto, crypto domain name, web3 did, das, decentralized domain, buy domain with crypto, domain eth, domain bnb, domain sol, namedao, cross-chain did, bit das, .bit account, did id, nervos, ckb' },
      // The Open Graph protocol
      { hid: 'og:description', property: 'og:description', content: '.bit is a blockchain-based, decentralized and open sourced account system. It is the first account system with broad compatibility and complete ownership and control by users. .bit can be used as a cryptocurrency collection account, as a domain name, or as an account for accessing general Internet services.' },
      { hid: 'og:title', property: 'og:title', content: '.bit - Web3 identities for you and your community.' },
      { hid: 'og:site_name', property: 'og:site_name', content: '.bit - Web3 identities for you and your community.' },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: 'https://did.id/' },
      { hid: 'og:image', property: 'og:image', content: `https://${abcConfig.hostname}/images/seo-thumbnail-image.png` },
      // Twitter
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:site', name: 'twitter:site', content: '.bit - Web3 identities for you and your community.' },
      { hid: 'twitter:title', name: 'twitter:title', content: '.bit - Web3 identities for you and your community.' },
      { hid: 'twitter:description', name: 'twitter:description', content: '.bit is a blockchain-based, decentralized and open sourced account system. It is the first account system with broad compatibility and complete ownership and control by users. .bit can be used as a cryptocurrency collection account, as a domain name, or as an account for accessing general Internet services.' },
      { hid: 'twitter:image', name: 'twitter:image', content: `https://${abcConfig.hostname}/images/seo-thumbnail-image.png` },
      { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: '.bit - Web3 identities for you and your community.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [{
      src: 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_11503_49.b945e977b7fb6c6cb0250bab3d59cb96.js',
      async: true
    }]
  },

  // Customize the progress-bar color
  loading: { color: '#00aadd' },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/init.scss',
    '~/assets/index.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuex-persistedstate.ts', mode: 'client' },
    '~/plugins/i18n',
    { src: '~/plugins/vee-validate', mode: 'client' },
    '~/plugins/tooltip',
    '~/plugins/services.ts',
    '~/plugins/alert.ts',
    '~/plugins/toast.ts',
    { src: '~/plugins/wallet-sdk.ts', mode: 'client' },
    { src: '~/plugins/url-query-parser.ts', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://composition-api.nuxtjs.org/
    '@nuxtjs/composition-api/module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://sentry.nuxtjs.org/
    ['@nuxtjs/google-gtag', {
      id: abcConfig.googleAnalyticsId,
      debug: !abcConfig.isProd
    }],
    [
      '@nuxtjs/sentry',
      {
        dsn: abcConfig.sentryDsn,
        disabled: !abcConfig.isProd,
        config: {
          autoSessionTracking: false
        }
      }
    ]
  ],

  router: {
    // disable prefetching globally
    prefetchLinks: false,
    middleware: 'main'
  },

  alias: {
    'bn.js': resolve(__dirname, './node_modules/bn.js/lib/bn.js')
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    babel: {
      presets ({ isServer }, [preset, options]) {
        let targets
        // Keep default target in server side
        if (isServer) {
          targets = { node: 'current' }
        }
        // Custom target in client side
        else {
          // Compile to ES5 for better compatibility in production
          if (abcConfig.isProd) {
            targets = { ie: 11 }
          }
          // Compile to ESNext for easier debugging in development
          else {
            targets = { chrome: 100 }
          }
        }
        options.targets = targets
      }
    }
  }
}
