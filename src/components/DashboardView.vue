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
            <div v-if="recentGratitudeLogs.length" class="d-flex flex-column gap-3">
              <v-card
                v-for="(log, i) in recentGratitudeLogs"
                :key="i"
                variant="outlined"
                class="rounded-lg cursor-pointer hover-card"
                @click="openGratitudeDialog(log)"
              >
                <v-card-item>
                  <v-card-title class="text-subtitle-1 font-weight-bold">{{ log.date }}</v-card-title>
                  <v-card-subtitle class="text-truncate mt-1 text-body-2">
                    1. {{ log.items[0] }}
                  </v-card-subtitle>
                </v-card-item>
              </v-card>
            </div>
            <div v-else class="text-center text-grey py-4">
              寫下今天值得感恩的事，累積正向能量！
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gratitude Modal -->
    <v-dialog v-model="isDialogOpen" max-width="500">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="text-h5 font-weight-bold secondary--text d-flex align-center mt-2">
          <v-icon left color="secondary" class="mr-2">mdi-weather-sunny</v-icon>
          {{ selectedLog?.date }} 的點滴
        </v-card-title>
        <v-card-text class="pt-4">
          <v-list lines="one" bg-color="transparent" class="pa-0">
            <v-list-item v-for="(item, index) in selectedLog?.items" :key="index" class="px-0 mb-3">
              <template v-slot:prepend>
                <v-avatar color="secondary" size="32" class="mr-4 font-weight-bold text-white elevation-1">
                  {{ index + 1 }}
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-1 text-wrap line-height-1-5">{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-center pb-4">
          <v-btn color="primary" variant="flat" rounded="pill" class="px-8 font-weight-bold" @click="isDialogOpen = false">
            關閉
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { store, pwaState, installPWA } from '../store';

const isDialogOpen = ref(false);
const selectedLog = ref(null);

const openGratitudeDialog = (log) => {
  selectedLog.value = log;
  isDialogOpen.value = true;
};

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
  color: rgb(var(--v-theme-primary));
}
.secondary--text {
  color: rgb(var(--v-theme-secondary)) !important;
}
.gap-3 {
  gap: 12px;
}
.cursor-pointer {
  cursor: pointer;
}
.hover-card {
  transition: all 0.2s ease;
  border-color: rgba(0, 0, 0, 0.12);
}
.hover-card:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-color: rgb(var(--v-theme-primary));
}
.line-height-1-5 {
  line-height: 1.5;
}
</style>
