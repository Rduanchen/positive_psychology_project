<template>
  <div class="gratitude-view mx-auto" style="max-width: 600px;">
    <transition name="slide" mode="out-in">
      <v-card v-if="!isCompleted" class="pa-6 rounded-xl" elevation="2" key="form">
        <v-card-title class="text-h5 font-weight-bold secondary--text mb-4 text-center">
          <v-icon left color="secondary" class="mr-2">mdi-weather-sunny</v-icon>
          今天的三件好事
        </v-card-title>
        
        <v-card-text>
          <p class="text-body-1 mb-6 text-center text-grey-darken-1">
            無論多微小的事情，都值得我們感恩。
          </p>

          <v-text-field
            v-model="items[0]"
            label="第一件好事"
            variant="outlined"
            color="secondary"
            prepend-inner-icon="mdi-numeric-1-circle"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="items[1]"
            label="第二件好事"
            variant="outlined"
            color="secondary"
            prepend-inner-icon="mdi-numeric-2-circle"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="items[2]"
            label="第三件好事"
            variant="outlined"
            color="secondary"
            prepend-inner-icon="mdi-numeric-3-circle"
            class="mb-2"
          ></v-text-field>
        </v-card-text>

        <v-card-actions class="justify-center mt-2">
          <v-btn
            color="secondary"
            size="x-large"
            rounded="pill"
            elevation="2"
            :disabled="!isFormValid"
            @click="submitGratitude"
            class="px-8 font-weight-bold text-black"
          >
            記錄感恩 <v-icon right>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- IG Share Card Simulation -->
      <v-card v-else class="pa-4 rounded-xl share-card" elevation="4" key="share">
        <div id="capture-area" class="pa-6 rounded-lg gradient-bg text-white">
          <div class="text-center mb-6">
            <v-icon size="48" color="white" class="mb-2">mdi-star-four-points-outline</v-icon>
            <h2 class="text-h4 font-weight-bold">PositiveFlow</h2>
            <p class="text-subtitle-1 opacity-80">{{ todayDate }}</p>
          </div>
          
          <v-card class="bg-white rounded-lg pa-4 text-black mb-4">
            <h3 class="text-h6 font-weight-bold secondary--text mb-3">今日感恩點滴</h3>
            <ul class="pl-4">
              <li v-for="(item, i) in items" :key="i" class="mb-2 text-body-1">
                {{ item }}
              </li>
            </ul>
          </v-card>
          
          <div class="text-center">
            <v-chip color="white" variant="outlined" class="font-weight-bold">
              Level {{ store.profile.level }} | Streak {{ store.profile.streak }}
            </v-chip>
          </div>
        </div>

        <v-card-actions class="justify-center mt-6 gap-4">
          <v-btn color="primary" variant="flat" rounded="pill" @click="downloadCard">
            <v-icon left>mdi-download</v-icon> 下載分享圖
          </v-btn>
          <v-btn color="grey" variant="text" rounded="pill" @click="returnToDashboard">
            完成
          </v-btn>
        </v-card-actions>
      </v-card>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import confetti from 'canvas-confetti';
import { store, addGratitudeLog } from '../store';

const emit = defineEmits(['completed']);

const items = ref(['', '', '']);
const isCompleted = ref(false);

const isFormValid = computed(() => {
  return items.value.filter(item => item.trim() !== '').length === 3;
});

const todayDate = computed(() => {
  return new Date().toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});

const submitGratitude = () => {
  // Add to store
  addGratitudeLog(items.value.map(item => item.trim()));
  
  // Trigger Confetti
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#009688', '#FFC107', '#FFFFFF']
  });

  isCompleted.value = true;
};

const downloadCard = () => {
  // Simulated download
  alert('此為模擬功能：圖片已「下載」至您的裝置！\n您可以將其分享至 Instagram 囉！');
};

const returnToDashboard = () => {
  emit('completed');
};
</script>

<style scoped>
.secondary--text {
  color: rgb(var(--v-theme-secondary)) !important;
}

.opacity-80 {
  opacity: 0.8;
}

.gap-4 {
  gap: 16px;
}

.gradient-bg {
  background: linear-gradient(135deg, #009688 0%, #4DB6AC 100%);
  position: relative;
  overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
