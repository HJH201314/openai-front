import { acceptHMRUpdate, defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

export type ChatSetting = {
  host?: string;
  localCache?: boolean; // 本地对话数据缓存
  roleRemember?: boolean; // 是否使用默认角色
  roleDefaultId?: number; // 默认角色
}

const defaultSetting: ChatSetting = {
  host: '/api',
  localCache: true,
  roleDefaultId: 0,
}

/* 设置相关 */
export const useSettingStore = defineStore('setting', () => {
  const settingStorage = useLocalStorage('setting', defaultSetting);
  const settings = computed(() => settingStorage.value);

  /**
   * 保存设置
   * @param key
   * @param value
   */
  function saveSetting<K extends keyof ChatSetting>(key: K, value: ChatSetting[K]) {
    settingStorage.value[key] = value;
  }

  function saveSettings(newSettings: ChatSetting) {
    settingStorage.value = { ...settingStorage.value, ...newSettings };
    console.log(newSettings)
    return Object.keys(newSettings).length;
  }

  /**
   * 重置设置
   * @param key (可选)要重置的设置
   */
  function resetSetting<K extends keyof ChatSetting>(key?: K) {
    if (key) {
      settingStorage.value[key] = defaultSetting[key];
    } else {
      settingStorage.value = defaultSetting;
    }
  }

  return {
    settings,
    saveSetting,
    saveSettings,
    resetSetting,
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot));
}