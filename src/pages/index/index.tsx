import { View, Text, Picker } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useChronosStore } from '@/stores/chronos'
import { useState } from 'react'
import './index.css'

export default function IndexPage() {
  const { actualSleepTime, idealSleepTime, setActualSleepTime, setIdealSleepTime, setSelectedCity } = useChronosStore()

  // 实际睡眠时间的选择值（默认定位到中间组）
  const [actualHourIndex, setActualHourIndex] = useState(2 + 24)  // 中间组的 02:00
  const [actualMinuteIndex, setActualMinuteIndex] = useState(0)

  // 理想睡眠时间的选择值
  const [idealHourIndex, setIdealHourIndex] = useState(23 + 24)  // 中间组的 23:00
  const [idealMinuteIndex, setIdealMinuteIndex] = useState(0)

  // 小时选项（0-23，重复3组以实现循环滚动效果）
  const hourOptions = Array.from({ length: 3 }, () =>
    Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  ).flat()

  // 分钟选项（0-59，每15分钟）
  const minuteOptions = Array.from({ length: 4 }, (_, i) => String(i * 15).padStart(2, '0'))

  // 将索引转换为时间字符串（取模24，因为小时选项是重复的）
  const formatTime = (hourIndex: number, minuteIndex: number): string => {
    const hour = hourOptions[hourIndex % 24]
    return `${hour}:${minuteOptions[minuteIndex]}`
  }

  // 实际睡眠时间选择器
  const handleActualTimeChange = (e: any) => {
    const [hourIdx, minuteIdx] = e.detail.value
    setActualHourIndex(hourIdx)
    setActualMinuteIndex(minuteIdx)
    setActualSleepTime(formatTime(hourIdx, minuteIdx))
  }

  // 理想睡眠时间选择器
  const handleIdealTimeChange = (e: any) => {
    const [hourIdx, minuteIdx] = e.detail.value
    setIdealHourIndex(hourIdx)
    setIdealMinuteIndex(minuteIdx)
    setIdealSleepTime(formatTime(hourIdx, minuteIdx))
  }

  // 页面加载时检查是否有保存的城市
  useLoad(() => {
    const savedCity = Taro.getStorageSync('selectedCity')
    const savedActualTime = Taro.getStorageSync('actualSleepTime')
    const savedIdealTime = Taro.getStorageSync('idealSleepTime')

    if (savedCity && savedActualTime && savedIdealTime) {
      // 恢复保存的数据
      setSelectedCity(savedCity)
      setActualSleepTime(savedActualTime)
      setIdealSleepTime(savedIdealTime)

      // 解析保存的时间，设置选择器的索引
      const [actualH, actualM] = savedActualTime.split(':').map(Number)
      const [idealH, idealM] = savedIdealTime.split(':').map(Number)

      // 将小时映射到中间组（索引24-47），实现循环效果
      setActualHourIndex(actualH + 24)
      setActualMinuteIndex(Math.floor(actualM / 15))
      setIdealHourIndex(idealH + 24)
      setIdealMinuteIndex(Math.floor(idealM / 15))

      // 直接跳转到城市展示页面
      Taro.redirectTo({ url: '/pages/city-showcase/index' })
    } else {
      // 没有保存数据，设置默认值（使用第二组的索引）
      setActualSleepTime('02:00')
      setIdealSleepTime('23:00')
    }
  })

  // 开始时光之旅
  const handleStartJourney = () => {
    if (!actualSleepTime || !idealSleepTime) {
      Taro.showToast({
        title: '请选择两个时间',
        icon: 'none'
      })
      return
    }

    Taro.redirectTo({ url: '/pages/search-time/index' })
  }

  return (
    <View className="index-page min-h-screen bg-slate-950 px-6 py-4 flex flex-col">
      {/* 标题区 */}
      <View className="mb-8">
        <Text className="text-white text-4xl font-bold block">Chronos</Text>
        <Text className="text-slate-400 text-base mt-2 block">
          精神时区切换
        </Text>
        <View className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mt-4 rounded-full" />
      </View>

      {/* 欢迎文案 */}
      <View className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-5 mb-8">
        <Text className="text-white text-lg font-semibold mb-2 block">🌙 晚安，熬夜的人</Text>
        <Text className="text-slate-300 text-sm leading-relaxed block">
          告别作息焦虑，找到你的精神时区。在这里，你的作息是合理的，因为你属于另一个时区。
        </Text>
      </View>

      {/* 时间选择区域 */}
      <View className="flex-1 flex flex-col justify-center gap-6">
        {/* 实际睡眠时间 */}
        <View>
          <Text className="text-white text-base font-semibold mb-3 block">
            1. 你通常在什么时候睡？
          </Text>
          <Picker
            mode="multiSelector"
            range={[hourOptions, minuteOptions]}
            value={[actualHourIndex, actualMinuteIndex]}
            onChange={handleActualTimeChange}
          >
            <View className="bg-slate-900/80 border border-slate-700 rounded-2xl px-5 py-4 active:bg-slate-800">
              <Text className="text-slate-400 text-xs mb-2 block">实际睡眠时间</Text>
              <View className="flex flex-row items-center justify-between">
                {actualSleepTime ? (
                  <Text className="text-white text-3xl font-bold block">
                    {actualSleepTime}
                  </Text>
                ) : (
                  <Text className="text-slate-500 text-lg block">请选择时间</Text>
                )}
                <Text className="text-indigo-400 text-xl block">→</Text>
              </View>
            </View>
          </Picker>
        </View>

        {/* 理想睡眠时间 */}
        <View>
          <Text className="text-white text-base font-semibold mb-3 block">
            2. 你觉得应该在什么时候睡？
          </Text>
          <Picker
            mode="multiSelector"
            range={[hourOptions, minuteOptions]}
            value={[idealHourIndex, idealMinuteIndex]}
            onChange={handleIdealTimeChange}
          >
            <View className="bg-slate-900/80 border border-slate-700 rounded-2xl px-5 py-4 active:bg-slate-800">
              <Text className="text-slate-400 text-xs mb-2 block">理想睡眠时间</Text>
              <View className="flex flex-row items-center justify-between">
                {idealSleepTime ? (
                  <Text className="text-white text-3xl font-bold block">
                    {idealSleepTime}
                  </Text>
                ) : (
                  <Text className="text-slate-500 text-lg block">请选择时间</Text>
                )}
                <Text className="text-indigo-400 text-xl block">→</Text>
              </View>
            </View>
          </Picker>
        </View>
      </View>

      {/* 开始按钮 */}
      <View className="mt-8">
        <View
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-8 py-4 text-center active:opacity-80"
          onClick={handleStartJourney}
        >
          <Text className="text-white font-semibold text-base block">开始时光之旅</Text>
        </View>
      </View>

      {/* 底部提示 */}
      <View className="mt-6 text-center">
        <Text className="text-slate-500 text-xs block">
          找到同路人，减少压力
        </Text>
      </View>
    </View>
  )
}
