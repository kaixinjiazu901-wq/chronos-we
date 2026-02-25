import { View, Text, Image } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useChronosStore } from '@/stores/chronos'
import './index.css'

export default function CityShowcasePage() {
  const { selectedCity } = useChronosStore()
  const [localTime, setLocalTime] = useState<string>('')

  // 计算当地时间
  const calculateLocalTime = (beijingTime: string, offset: number): string => {
    const [h, m] = beijingTime.split(':').map(Number)

    // 北京时间是 UTC+8，先转换为 UTC 时间（减去 8 小时）
    const utcMinutes = h * 60 + m - 8 * 60

    // 再加上目标城市的偏移量
    const localMinutes = utcMinutes + offset * 60

    // 处理跨天
    let normalizedMinutes = localMinutes % (24 * 60)
    if (normalizedMinutes < 0) normalizedMinutes += 24 * 60

    const localH = Math.floor(normalizedMinutes / 60)
    const localM = normalizedMinutes % 60

    return `${String(localH).padStart(2, '0')}:${String(localM).padStart(2, '0')}`
  }

  // 更新当地时间
  useEffect(() => {
    if (!selectedCity) return

    const updateTime = () => {
      const now = new Date()
      const beijingTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const time = calculateLocalTime(beijingTime, selectedCity.offset)
      setLocalTime(time)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [selectedCity])

  // 如果没有选择城市，返回首页
  useEffect(() => {
    if (!selectedCity) {
      Taro.redirectTo({ url: '/pages/index/index' })
    }
  }, [selectedCity])

  if (!selectedCity) {
    return null
  }

  // 计算睡眠倒计时
  const calculateSleepCountdown = (): string => {
    const now = new Date()
    const [h, m] = localTime.split(':').map(Number)

    const sleepTime = new Date()
    sleepTime.setHours(h, m, 0, 0)

    let diff = sleepTime.getTime() - now.getTime()
    if (diff < 0) diff += 24 * 60 * 60 * 1000 // 跨天

    const hours = Math.floor(diff / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))

    return `${hours}小时${minutes}分钟`
  }

  return (
    <View className="city-showcase-page min-h-screen bg-slate-950 px-6 py-4">
      {/* 打招呼区 */}
      <View className="mb-6">
        <Text className="text-white text-2xl font-bold block">
          晚上好，精神{selectedCity.name}人
        </Text>
        <Text className="text-slate-400 text-base mt-2 block">
          距离睡眠还有 {calculateSleepCountdown()}，尽情玩儿吧！
        </Text>
      </View>

      {/* 精神身份标签 */}
      <View className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-4 py-2 mb-6">
        <Text className="text-white text-sm font-medium block">精神{selectedCity.name}人</Text>
      </View>

      {/* 城市图片 */}
      <View className="relative w-full h-64 rounded-2xl overflow-hidden mb-6">
        <Image
          src={selectedCity.imageUrl}
          mode="aspectFill"
          className="w-full h-full"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4">
          <Text className="text-white text-lg font-semibold block">{selectedCity.name}</Text>
          <Text className="text-slate-300 text-sm block">{selectedCity.englishName}</Text>
        </View>
      </View>

      {/* 当地时间 */}
      <View className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-lg border border-indigo-500/30 rounded-2xl p-6 mb-6 text-center">
        <Text className="text-slate-400 text-sm block">当地时间</Text>
        <Text className="text-white text-5xl font-bold tracking-wider mt-2 block">
          {localTime}
        </Text>
        <Text className="text-slate-400 text-xs mt-2 block">{selectedCity.timezone}</Text>
      </View>

      {/* 诗意文案 */}
      <View className="bg-slate-900/60 backdrop-blur-sm border-l-4 border-indigo-500 rounded-r-xl p-4 mb-6">
        <View className="flex items-start">
          <Text className="text-2xl mr-3 block">{selectedCity.weatherIcon}</Text>
          <Text className="text-slate-300 text-base italic flex-1 block">
            &ldquo;{selectedCity.poeticLine}&rdquo;
          </Text>
        </View>
      </View>

      {/* 推荐语 */}
      <View className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <Text className="text-white text-base font-semibold block">推荐语</Text>
        <Text className="text-slate-300 text-sm mt-2 block">{selectedCity.recommendation}</Text>
      </View>

      {/* 重新开始按钮 */}
      <View className="mt-8">
        <View
          className="bg-slate-800/80 border border-slate-700 rounded-2xl px-6 py-4 text-center"
          onClick={() => {
            // 清除本地存储中选中的城市，但保留睡眠时间设置
            Taro.removeStorageSync('selectedCity')
            
            // 重置状态
            useChronosStore.getState().reset()
            // 跳转到首页
            Taro.redirectTo({ url: '/pages/index/index' })
          }}
        >
          <Text className="text-slate-300 font-medium text-base block">重新选择</Text>
        </View>
      </View>
    </View>
  )
}
