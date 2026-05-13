<template>
  <div class="settings-view mx-auto" style="max-width: 600px;">

    <!-- PWA Install Card — hidden when already running as installed app -->
    <v-card
      v-if="!pwaState.isStandalone"
      class="pa-6 rounded-xl mb-6 install-card"
      elevation="3"
    >
      <v-card-title class="text-h5 font-weight-bold primary--text mb-2 d-flex align-center">
        <v-icon left color="primary" class="mr-2">mdi-cellphone-arrow-down</v-icon>
        安裝 App
      </v-card-title>
      <v-card-text>
        <!-- Android / Chrome: show install button when prompt is available -->
        <template v-if="pwaState.deferredPrompt">
          <p class="text-body-2 text-grey-darken-1 mb-4">
            將「debug your life」安裝到你的主畫面，享受更流暢的原生體驗。
          </p>
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            rounded="pill"
            block
            prepend-icon="mdi-download"
            @click="handleInstall"
          >
            安裝到主畫面
          </v-btn>
        </template>

        <!-- iOS: manual instructions since Safari doesn't fire beforeinstallprompt -->
        <template v-else-if="pwaState.isIOS">
          <p class="text-body-2 text-grey-darken-1 mb-3">
            在 Safari 中，點擊下方分享按鈕 <v-icon size="18" color="primary">mdi-export-variant</v-icon>，然後選擇
            <strong>「加入主畫面」</strong> 即可安裝。
          </p>
          <v-alert type="info" variant="tonal" rounded="lg" density="compact">
            <template #prepend>
              <v-icon>mdi-apple</v-icon>
            </template>
            請確認你使用的是 <strong>Safari</strong> 瀏覽器，其他瀏覽器不支援 iOS 上的 PWA 安裝。
          </v-alert>
        </template>

        <!-- Already installed or prompt not yet available -->
        <template v-else>
          <p class="text-body-2 text-grey-darken-1">
            你的瀏覽器目前尚未提供安裝提示。請確認你正在使用 Chrome 或 Edge，並且尚未安裝此 App。
          </p>
        </template>
      </v-card-text>
    </v-card>

    <!-- Already installed badge -->
    <v-alert
      v-else
      type="success"
      variant="tonal"
      rounded="xl"
      class="mb-6"
      density="compact"
      icon="mdi-check-circle"
    >
      此 App 已安裝在你的裝置上 🎉
    </v-alert>

    <v-card class="pa-6 rounded-xl mb-6" elevation="2">
      <v-card-title class="text-h5 font-weight-bold primary--text mb-4 d-flex align-center">
        <v-icon left color="primary" class="mr-2">mdi-account</v-icon>
        個人數據
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6" class="text-center">
            <div class="text-h4 font-weight-bold secondary--text">{{ store.profile.level }}</div>
            <div class="text-caption text-grey">目前等級</div>
          </v-col>
          <v-col cols="6" class="text-center">
            <div class="text-h4 font-weight-bold primary--text">{{ store.profile.streak }}</div>
            <div class="text-caption text-grey">連續登入天數</div>
          </v-col>
          <v-col cols="6" class="text-center">
            <div class="text-h5 font-weight-bold">{{ totalFocusTime }}</div>
            <div class="text-caption text-grey">總專注分鐘數</div>
          </v-col>
          <v-col cols="6" class="text-center">
            <div class="text-h5 font-weight-bold">{{ store.gratitudeLogs.length }}</div>
            <div class="text-caption text-grey">感恩日記篇數</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="pa-6 rounded-xl" elevation="2">
      <v-card-title class="text-h5 font-weight-bold primary--text mb-4 d-flex align-center">
        <v-icon left color="primary" class="mr-2">mdi-database-sync</v-icon>
        資料管理
      </v-card-title>
      <v-card-text>
        <p class="text-body-2 text-grey-darken-1 mb-6">
          你的資料安全地儲存在本機瀏覽器 (localStorage)。你可以匯出備份，或在其他裝置匯入。
        </p>

        <div class="d-flex flex-column gap-4">
          <v-btn color="primary" variant="flat" size="large" rounded="pill" block @click="handleExport">
            <v-icon left>mdi-export</v-icon> 匯出備份 (JSON)
          </v-btn>

          <div>
            <v-file-input
              v-model="importFile"
              accept=".json"
              label="選擇備份檔案"
              variant="outlined"
              color="primary"
              prepend-icon="mdi-file-upload"
              hide-details
              class="mb-2"
              @change="handleFileSelected"
            ></v-file-input>
            <v-btn 
              color="secondary" 
              variant="flat" 
              size="large" 
              rounded="pill" 
              block 
              :disabled="!importFile"
              @click="handleImport"
            >
              <v-icon left>mdi-import</v-icon> 匯入資料
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, exportData, importData, pwaState, installPWA } from '../store';

const importFile = ref(null);

const totalFocusTime = computed(() => {
  return store.focusLogs.reduce((total, log) => total + log.minutes, 0);
});

const handleExport = () => {
  exportData();
};

const handleInstall = async () => {
  await installPWA();
};

const handleFileSelected = (event) => {
  // Clear any previous import state if needed
};

const handleImport = () => {
  if (!importFile.value) return;
  
  const file = Array.isArray(importFile.value) ? importFile.value[0] : importFile.value;
  
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target.result;
    if (confirm('匯入資料將覆蓋目前的進度，確定要繼續嗎？')) {
      importData(contents);
      importFile.value = null; // reset
    }
  };
  reader.readAsText(file);
};
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
</style>
