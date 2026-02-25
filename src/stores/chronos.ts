import { create } from 'zustand'

interface ChronosState {
  // 用户选择的时间
  actualSleepTime: string  // 实际睡眠时间
  idealSleepTime: string   // 理想睡眠时间
  selectedCity: City | null  // 选中的城市

  // 设置方法
  setActualSleepTime: (time: string) => void
  setIdealSleepTime: (time: string) => void
  setSelectedCity: (city: City) => void
  reset: () => void
}

export interface City {
  id: string
  name: string
  englishName: string
  timezone: string  // 时区偏移，如 "UTC-5"
  offset: number    // 时区偏移小时数，如 -5
  imageUrl: string
  recommendation: string
  poeticLine: string
  weatherIcon: string
}

export const useChronosStore = create<ChronosState>((set) => ({
  actualSleepTime: '',
  idealSleepTime: '',
  selectedCity: null,

  setActualSleepTime: (time) => set({ actualSleepTime: time }),
  setIdealSleepTime: (time) => set({ idealSleepTime: time }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  // reset 仅重置选中城市，保留睡眠时间设置
  reset: () => set({ selectedCity: null }),
}))
