import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#009688', // Teal (心流)
          secondary: '#FFC107', // Amber (溫暖/獎勵)
          background: '#F5F5F5',
          surface: '#FFFFFF',
        }
      }
    }
  }
})

createApp(App).use(vuetify).mount('#app')
