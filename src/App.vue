<template>
  <v-app>
    <v-app-bar color="primary" class="text-white" elevation="2">
      <v-toolbar-title class="font-weight-bold">
        <v-icon class="mr-2">mdi-spa</v-icon> debug your life
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-flex align-center px-4">
        <v-chip color="secondary" text-color="black" variant="flat" class="mr-2 font-weight-bold">
          <v-icon left size="small" class="mr-1">mdi-star</v-icon>
          Lvl {{ store.profile.level }}
        </v-chip>
        <v-chip color="white" text-color="primary" variant="flat" class="font-weight-bold">
          <v-icon left size="small" class="mr-1">mdi-fire</v-icon>
          {{ store.profile.streak }} 天
        </v-chip>
      </div>
    </v-app-bar>

    <v-main class="bg-background">
      <v-container class="h-100 pa-4" fluid>
        <transition name="fade" mode="out-in">
          <DashboardView v-if="currentTab === 'dashboard'" />
          <FocusView v-else-if="currentTab === 'focus'" @completed="currentTab = 'dashboard'" />
          <GratitudeView v-else-if="currentTab === 'gratitude'" @completed="currentTab = 'dashboard'" />
          <SettingsView v-else-if="currentTab === 'settings'" />
        </transition>
      </v-container>
    </v-main>

    <v-bottom-navigation v-model="currentTab" color="primary" grow active>
      <v-btn value="dashboard">
        <v-icon>mdi-view-dashboard</v-icon>
        <span>儀表板</span>
      </v-btn>

      <v-btn value="focus">
        <v-icon>mdi-timer-outline</v-icon>
        <span>專注心流</span>
      </v-btn>

      <v-btn value="gratitude">
        <v-icon>mdi-heart-outline</v-icon>
        <span>感恩日記</span>
      </v-btn>

      <v-btn value="settings">
        <v-icon>mdi-cog-outline</v-icon>
        <span>設定</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { store, checkStreak, initPWA } from './store';
import DashboardView from './components/DashboardView.vue';
import FocusView from './components/FocusView.vue';
import GratitudeView from './components/GratitudeView.vue';
import SettingsView from './components/SettingsView.vue';

const currentTab = ref('dashboard');

onMounted(() => {
  checkStreak();
  initPWA();
});
</script>

<style>
.bg-background {
  background-color: #F5F5F5;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
