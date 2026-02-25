import { View, Text, Picker } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useChronosStore } from '@/stores/chronos'
import { useState } from 'react'
import './index.css'

export default function IndexPage() {
  const { actualSleepTime, idealSleepTime, setActualSleepTime, setIdealSleepTime, setSelectedCity } = useChronosStore()

  // 小时选项（0-23，重复50组以实现循环滚动效果）
  const HOUR_GROUP_COUNT = 50
  const HOUR_CENTER_GROUP = Math.floor(HOUR_GROUP_COUNT / 2)
  const hourOptions = Array.from({ length: HOUR_GROUP_COUNT }, () =>
    Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
  ).flat()

  // 分钟选项（只有00和30，不循环）
  const minuteOptions = ['00', '30']

  // 实际睡眠时间的选择值
  const [actualHourIndex, setActualHourIndex] = useState(2 + 24 * HOUR_CENTER_GROUP)
  const [actualMinuteIndex, setActualMinuteIndex] = useState(0) // 默认为00

  // 理想睡眠时间的选择值
  const [idealHourIndex, setIdealHourIndex] = useState(23 + 24 * HOUR_CENTER_GROUP)
  const [idealMinuteIndex, setIdealMinuteIndex] = useState(0) // 默认为00

  // 将索引转换为时间字符串
  const formatTime = (hourIndex: number, minuteIndex: number): string => {
    const hour = String(hourIndex % 24).padStart(2, '0')
    const minute = minuteIndex === 0 ? '00' : '30'
    return `${hour}:${minute}`
  }

  // 实际睡眠时间选择器
  const handleActualTimeChange = (e: any) => {
    const [hourIdx, minuteIdx] = e.detail.value
    
    // 计算真实的时间索引
    const realHourIdx = hourIdx % 24
    
    // 小时保持无限循环逻辑
    const centerHourIdx = realHourIdx + 24 * HOUR_CENTER_GROUP

    // 分钟直接使用选中值（0或1）
    setActualHourIndex(centerHourIdx)
    setActualMinuteIndex(minuteIdx)
    setActualSleepTime(formatTime(realHourIdx, minuteIdx))
  }

  // 理想睡眠时间选择器
  const handleIdealTimeChange = (e: any) => {
    const [hourIdx, minuteIdx] = e.detail.value

    // 计算真实的时间索引
    const realHourIdx = hourIdx % 24
    
    // 小时保持无限循环逻辑
    const centerHourIdx = realHourIdx + 24 * HOUR_CENTER_GROUP

    // 分钟直接使用选中值（0或1）
    setIdealHourIndex(centerHourIdx)
    setIdealMinuteIndex(minuteIdx)
    setIdealSleepTime(formatTime(realHourIdx, minuteIdx))
  }

  // 页面加载时恢复上次选择的时间（不自动跳转）
  useLoad(() => {
    const savedCity = Taro.getStorageSync('selectedCity')
    const savedActualTime = Taro.getStorageSync('actualSleepTime')
    const savedIdealTime = Taro.getStorageSync('idealSleepTime')

    if (savedActualTime) {
      // 恢复保存的实际睡眠时间
      setActualSleepTime(savedActualTime)
      
      const [actualH, actualM] = savedActualTime.split(':').map(Number)
      setActualHourIndex(actualH + 24 * HOUR_CENTER_GROUP)
      // 根据分钟数判断索引：30分对应1，00分对应0
      setActualMinuteIndex(actualM >= 30 ? 1 : 0)
    }

    if (savedIdealTime) {
      // 恢复保存的理想睡眠时间
      setIdealSleepTime(savedIdealTime)
      
      const [idealH, idealM] = savedIdealTime.split(':').map(Number)
      setIdealHourIndex(idealH + 24 * HOUR_CENTER_GROUP)
      // 根据分钟数判断索引
      setIdealMinuteIndex(idealM >= 30 ? 1 : 0)
    }

    // 如果有保存的城市，可以在这里处理
    // 但不自动跳转，让用户可以选择新的时间
    if (savedCity) {
      setSelectedCity(savedCity)
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
        <Text className="text-white text-lg font-semibold mb-2 block">你好，同空间的朋友</Text>
        <Text className="text-slate-300 text-sm leading-relaxed block">
          告别作息焦虑，找到你的精神时区。在这里，你的作息是合理的，因为你属于另一个时区。
        </Text>
      </View>

      {/* 时间选择区域 */}
      <View className="flex-1 flex flex-col justify-center gap-6">
        {/* 实际睡眠时间 */}
        <View>
          <Text className="text-white text-base font-semibold mb-3 block">
            1. 您通常在什么时候睡？
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
