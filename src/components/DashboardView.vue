<template>
  <div class="dashboard">
    <!-- PWA Install Banner -->
    <v-row v-if="pwaState.deferredPrompt || (pwaState.isIOS && !pwaState.isStandalone)">
      <v-col cols="12">
        <v-alert
          color="secondary"
          variant="tonal"
          icon="mdi-cellphone-link"
          prominent
          class="rounded-xl border-secondary font-weight-medium"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-bold mb-1">將 debug your life 加入主畫面</div>
              <div class="text-body-2" v-if="pwaState.deferredPrompt">
                安裝應用程式，獲得全螢幕的沉浸式心流體驗！
              </div>
              <div class="text-body-2" v-else-if="pwaState.isIOS && !pwaState.isStandalone">
                點擊瀏覽器底部的「分享」圖示 <v-icon size="small">mdi-export-variant</v-icon>，<br>
                然後選擇「加入主畫面 <v-icon size="small">mdi-plus-box-outline</v-icon>」
              </div>
            </div>
            <v-btn
              v-if="pwaState.deferredPrompt"
              color="secondary"
              variant="flat"
              class="font-weight-bold text-black"
              rounded="pill"
              @click="installPWA"
            >
              立即安裝
            </v-btn>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 rounded-xl" elevation="2">
          <v-card-title class="text-h5 font-weight-bold primary--text">
            歡迎回來，準備好進入心流了嗎？
          </v-card-title>
          <v-card-text>
            <div class="d-flex align-center mt-4">
              <v-avatar color="primary" size="64" class="mr-4 elevation-2">
                <v-icon color="white" size="36">mdi-leaf</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-end mb-1">
                  <span class="text-h6 font-weight-bold">Level {{ store.profile.level }}</span>
                  <span class="text-caption text-grey-darken-1">{{ store.profile.xp }} / {{ nextLevelXP }} XP</span>
                </div>
                <v-progress-linear
                  :model-value="progressPercentage"
                  color="secondary"
                  height="12"
                  rounded
                  striped
                ></v-progress-linear>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card class="h-100 rounded-xl" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-history</v-icon>
            近期專注
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start" v-if="recentFocusLogs.length">
              <v-timeline-item
                v-for="(log, i) in recentFocusLogs"
                :key="i"
                dot-color="primary"
                size="small"
              >
                <div class="mb-1">
                  <div class="font-weight-normal">
                    <strong>{{ log.minutes }} 分鐘</strong>
                  </div>
                  <div class="text-caption">{{ log.date }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
            <div v-else class="text-center text-grey py-4">
              尚未有專注紀錄，開始一次心流體驗吧！
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="h-100 rounded-xl" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="secondary" class="mr-2">mdi-heart</v-icon>
            感恩點滴
          </v-card-title>
          <v-card-text>
            <v-list lines="two" v-if="recentGratitudeLogs.length">
              <v-list-item
                v-for="(log, i) in recentGratitudeLogs"
                :key="i"
                class="px-0"
              >
                <v-list-item-title class="font-weight-bold">{{ log.date }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <ul class="pl-4">
                    <li v-for="(item, j) in log.items" :key="j">{{ item }}</li>
                  </ul>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-grey py-4">
              寫下今天值得感恩的事，累積正向能量！
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store, pwaState, installPWA } from '../store';

const nextLevelXP = computed(() => {
  return Math.pow(store.profile.level, 2) * 100;
});

const currentLevelBaseXP = computed(() => {
  return Math.pow(store.profile.level - 1, 2) * 100;
});

const progressPercentage = computed(() => {
  const currentXP = store.profile.xp - currentLevelBaseXP.value;
  const requiredXP = nextLevelXP.value - currentLevelBaseXP.value;
  return Math.min(100, Math.max(0, (currentXP / requiredXP) * 100));
});

const recentFocusLogs = computed(() => {
  return [...store.focusLogs].reverse().slice(0, 5);
});

const recentGratitudeLogs = computed(() => {
  return [...store.gratitudeLogs].reverse().slice(0, 3);
});
</script>

<style scoped>
.v-card-title {
  color: #009688;
}
</style>
