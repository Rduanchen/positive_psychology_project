<template>
  <v-card class="rounded-xl mx-auto" elevation="2" max-width="600">
    <v-card-title class="text-h5 text-center pt-6 primary--text font-weight-bold">
      進入心流儀式
    </v-card-title>
    
    <v-stepper v-model="step" class="elevation-0 bg-transparent" hide-actions>
      <v-stepper-header class="elevation-0">
        <v-stepper-item value="1" color="primary" :complete="step > 1">準備</v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item value="2" color="primary" :complete="step > 2">呼吸</v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item value="3" color="primary">專注</v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <!-- Step 1: Checklist -->
        <v-stepper-window-item value="1">
          <div class="text-center mb-6">
            <p class="text-subtitle-1 text-grey-darken-1">為自己創造一個不受打擾的空間</p>
          </div>
          <v-list class="bg-transparent">
            <v-list-item @click="checklist.env = !checklist.env">
              <template v-slot:prepend>
                <v-checkbox-btn v-model="checklist.env" color="primary"></v-checkbox-btn>
              </template>
              <v-list-item-title class="text-body-1">環境舒適，桌面整潔</v-list-item-title>
            </v-list-item>
            <v-list-item @click="checklist.notif = !checklist.notif">
              <template v-slot:prepend>
                <v-checkbox-btn v-model="checklist.notif" color="primary"></v-checkbox-btn>
              </template>
              <v-list-item-title class="text-body-1">已關閉通訊軟體與干擾</v-list-item-title>
            </v-list-item>
            <v-list-item @click="checklist.water = !checklist.water">
              <template v-slot:prepend>
                <v-checkbox-btn v-model="checklist.water" color="primary"></v-checkbox-btn>
              </template>
              <v-list-item-title class="text-body-1">準備好一杯水</v-list-item-title>
            </v-list-item>
          </v-list>
          <div class="d-flex justify-center mt-6">
            <v-btn color="primary" size="large" rounded="pill" :disabled="!isChecklistComplete" @click="startBreathing">
              準備好了 <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-stepper-window-item>

        <!-- Step 2: Breathing -->
        <v-stepper-window-item value="2">
          <div class="text-center py-8">
            <h3 class="text-h6 mb-2">{{ breathingPhaseText }}</h3>
            <p class="text-caption text-grey">剩餘 {{ breathingCount }} 次</p>
            
            <div class="breathing-container my-8 mx-auto">
              <div class="breathing-circle" :class="breathingClass"></div>
            </div>

            <v-btn v-if="breathingDone" color="primary" size="large" rounded="pill" @click="step = '3'">
              開始計時 <v-icon right>mdi-timer-play</v-icon>
            </v-btn>
            <v-btn v-else variant="text" color="grey" @click="skipBreathing">
              跳過
            </v-btn>
          </div>
        </v-stepper-window-item>

        <!-- Step 3: Timer -->
        <v-stepper-window-item value="3">
          <div class="text-center py-6">
            <div class="timer-display text-h1 font-weight-bold primary--text mb-6">
              {{ formattedTime }}
            </div>
            
            <div v-if="!isTimerRunning && timeRemaining === focusTime * 60" class="mb-6">
              <p class="mb-2">設定專注時間 (分鐘)</p>
              <v-slider
                v-model="focusTime"
                min="5"
                max="60"
                step="5"
                color="primary"
                thumb-label="always"
                @update:modelValue="resetTimer"
              ></v-slider>
            </div>

            <div class="d-flex justify-center gap-4">
              <v-btn
                v-if="!isTimerRunning"
                color="primary"
                size="x-large"
                rounded="pill"
                @click="startTimer"
                elevation="3"
              >
                <v-icon left>mdi-play</v-icon> 開始專注
              </v-btn>
              <v-btn
                v-else
                color="secondary"
                size="x-large"
                rounded="pill"
                @click="pauseTimer"
                elevation="3"
              >
                <v-icon left>mdi-pause</v-icon> 暫停
              </v-btn>

              <v-btn
                v-if="timeRemaining < focusTime * 60"
                variant="outlined"
                color="grey"
                size="x-large"
                rounded="pill"
                @click="giveUp"
              >
                <v-icon left>mdi-stop</v-icon> 放棄
              </v-btn>
            </div>
          </div>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>

    <v-dialog v-model="showCompletion" max-width="400" persistent>
      <v-card class="rounded-xl text-center pa-6">
        <v-icon color="secondary" size="64" class="mb-4">mdi-trophy</v-icon>
        <v-card-title class="text-h5 font-weight-bold px-0">太棒了！</v-card-title>
        <v-card-text class="px-0 py-2">
          你完成了 {{ focusTime }} 分鐘的專注<br>
          獲得了 <strong class="secondary--text">{{ focusTime * 5 }} XP</strong>！
        </v-card-text>
        <v-card-actions class="justify-center mt-4">
          <v-btn color="primary" variant="flat" rounded="pill" size="large" @click="finishSession">
            返回儀表板
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { addFocusLog } from '../store';

const emit = defineEmits(['completed']);

// Step 1: Checklist
const step = ref('1');
const checklist = ref({
  env: false,
  notif: false,
  water: false
});

const isChecklistComplete = computed(() => {
  return checklist.value.env && checklist.value.notif;
});

// Step 2: Breathing
const breathingPhaseText = ref('準備吸氣...');
const breathingClass = ref('');
const breathingCount = ref(5);
const breathingDone = ref(false);
let breathingInterval = null;

const startBreathing = () => {
  step.value = '2';
  breathingCount.value = 5;
  breathingDone.value = false;
  runBreathingCycle();
};

const runBreathingCycle = () => {
  if (breathingCount.value <= 0) {
    breathingPhaseText.value = '呼吸完成，心情平靜';
    breathingClass.value = '';
    breathingDone.value = true;
    return;
  }

  // Inhale 4s
  breathingPhaseText.value = '吸氣...';
  breathingClass.value = 'inhale';
  
  setTimeout(() => {
    // Exhale 4s
    breathingPhaseText.value = '呼氣...';
    breathingClass.value = 'exhale';
    
    setTimeout(() => {
      breathingCount.value--;
      runBreathingCycle();
    }, 4000);
  }, 4000);
};

const skipBreathing = () => {
  breathingCount.value = 0;
  breathingDone.value = true;
  step.value = '3';
};

// Step 3: Timer
const focusTime = ref(25); // minutes
const timeRemaining = ref(25 * 60); // seconds
const isTimerRunning = ref(false);
const showCompletion = ref(false);
let timerInterval = null;

const formattedTime = computed(() => {
  const m = Math.floor(timeRemaining.value / 60);
  const s = timeRemaining.value % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
});

const resetTimer = () => {
  timeRemaining.value = focusTime.value * 60;
  isTimerRunning.value = false;
  clearInterval(timerInterval);
};

const startTimer = () => {
  if (timeRemaining.value <= 0) resetTimer();
  isTimerRunning.value = true;
  
  timerInterval = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval);
      isTimerRunning.value = false;
      completeFocus();
    }
  }, 1000);
};

const pauseTimer = () => {
  isTimerRunning.value = false;
  clearInterval(timerInterval);
};

const giveUp = () => {
  if (confirm('確定要放棄這次的心流體驗嗎？')) {
    pauseTimer();
    resetTimer();
    step.value = '1';
    checklist.value = { env: false, notif: false, water: false };
    emit('completed');
  }
};

const completeFocus = () => {
  addFocusLog(focusTime.value);
  showCompletion.value = true;
};

const finishSession = () => {
  showCompletion.value = false;
  resetTimer();
  step.value = '1';
  checklist.value = { env: false, notif: false, water: false };
  emit('completed');
};

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.primary--text {
  color: rgb(var(--v-theme-primary)) !important;
}

.secondary--text {
  color: rgb(var(--v-theme-secondary)) !important;
}

/* Breathing Animation */
.breathing-container {
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(0, 150, 136, 0.1);
}

.breathing-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-primary));
  transition: transform 4s ease-in-out;
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.5);
}

.breathing-circle.inhale {
  transform: scale(2.5);
}

.breathing-circle.exhale {
  transform: scale(1);
}

.timer-display {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 2px;
}
</style>
