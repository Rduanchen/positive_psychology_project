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
      },
      dark: {
        dark: true,
        colors: {
          primary: '#4DB6AC', // 較柔和的 Teal 適合暗色
          secondary: '#FFD54F', // 較柔和的 Amber
          background: '#121C1A', // 深青黑色，帶來沉靜感
          surface: '#1A2926', // 稍微亮一點的深青色卡片
        }
      }
    }
  }
})

createApp(App).use(vuetify).mount('#app')
