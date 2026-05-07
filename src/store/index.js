import { reactive, watch } from 'vue';

const STORAGE_KEY = 'positiveflow_data';

// Default schema
const defaultState = {
  profile: { xp: 0, level: 1, streak: 0, lastActiveDate: '', isDark: false },
  focusLogs: [], // { date: 'YYYY-MM-DD', minutes: 0 }
  gratitudeLogs: [] // { date: 'YYYY-MM-DD', items: [] }
};

// Initialize from localStorage or fallback to default
const loadData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : JSON.parse(JSON.stringify(defaultState));
};

export const store = reactive(loadData());

// Watch for any changes and persist to localStorage
watch(store, (newState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
}, { deep: true });

// Check and update streak upon app launch
export const checkStreak = () => {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = store.profile.lastActiveDate;

  if (lastActive === today) return; // Already checked today

  if (lastActive) {
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays === 1) {
      store.profile.streak += 1;
    } else if (diffDays > 1) {
      store.profile.streak = 1; // Reset streak if missed a day
    }
  } else {
    store.profile.streak = 1; // First day
  }

  store.profile.lastActiveDate = today;
};

// Calculate level based on XP (Level = floor(sqrt(XP/100)) + 1)
const updateLevel = () => {
  store.profile.level = Math.floor(Math.sqrt(store.profile.xp / 100)) + 1;
};

export const toggleTheme = () => {
  store.profile.isDark = !store.profile.isDark;
};

// Reward logic
export const addXP = (amount) => {
  store.profile.xp += amount;
  updateLevel();
};

export const addFocusLog = (minutes) => {
  const today = new Date().toISOString().split('T')[0];
  store.focusLogs.push({ date: today, minutes });
  // Reward: 5 XP per minute focused
  addXP(minutes * 5);
};

export const addGratitudeLog = (items) => {
  const today = new Date().toISOString().split('T')[0];
  store.gratitudeLogs.push({ date: today, items });
  // Reward: 30 XP per gratitude entry
  addXP(30);
};

// Data management
export const exportData = () => {
  const dataStr = JSON.stringify(store, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = `positiveflow_backup_${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    if (data.profile && data.focusLogs && data.gratitudeLogs) {
      Object.assign(store, data);
      alert('資料匯入成功！');
    } else {
      alert('匯入失敗：資料格式不符');
    }
  } catch (error) {
    alert('匯入失敗：檔案無法解析');
  }
};

// PWA Logic
export const pwaState = reactive({
  deferredPrompt: null,
  isIOS: false,
  isStandalone: false,
});

export const initPWA = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pwaState.deferredPrompt = e;
  });

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMacWithTouch = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  pwaState.isIOS = /iphone|ipad|ipod/.test(userAgent) || isMacWithTouch;
  pwaState.isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
};

export const installPWA = async () => {
  if (pwaState.deferredPrompt) {
    pwaState.deferredPrompt.prompt();
    const { outcome } = await pwaState.deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      pwaState.deferredPrompt = null;
    }
  }
};

