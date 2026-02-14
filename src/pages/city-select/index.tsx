import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useChronosStore, type City } from '@/stores/chronos'
import { CITIES_DATA } from '@/data/cities'
import { useState, useEffect } from 'react'
import './index.css'

export default function CitySelectPage() {
  const { actualSleepTime, idealSleepTime, setSelectedCity } = useChronosStore()
  const [currentTime, setCurrentTime] = useState<string>('')

  // 获取当前时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // 计算匹配时间：目标时间 = 理想睡眠时间 - (当前时间到实际睡眠时间的时长)
  const calculateMatchTime = (): string => {
    if (!actualSleepTime || !idealSleepTime || !currentTime) return '--:--'

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const [idealH, idealM] = idealSleepTime.split(':').map(Number)
    const [actualH, actualM] = actualSleepTime.split(':').map(Number)

    const idealMinutes = idealH * 60 + idealM
    const actualMinutes = actualH * 60 + actualM

    // 计算从当前时间到实际睡眠时间的时长（考虑跨日期）
    let durationToActualSleep = actualMinutes - currentMinutes
    if (durationToActualSleep <= 0) {
      durationToActualSleep += 24 * 60 // 跨越午夜，加24小时
    }

    // 目标时间 = 理想睡眠时间 - 时长
    let targetMinutes = idealMinutes - durationToActualSleep
    if (targetMinutes < 0) {
      targetMinutes += 24 * 60 // 跨越午夜，加24小时
    }

    const targetHour = Math.floor(targetMinutes / 60)
    const targetMinute = targetMinutes % 60

    return `${String(targetHour).padStart(2, '0')}:${String(targetMinute).padStart(2, '0')}`
  }

  // 计算目标城市的 UTC 偏移量
  const calculateTargetOffset = (): number => {
    const targetTime = calculateMatchTime()
    if (targetTime === '--:--') return 0

    const now = new Date()
    const utcMinutes = now.getHours() * 60 + now.getMinutes() - 8 * 60
    const [targetHour, targetMinute] = targetTime.split(':').map(Number)
    const targetMinutes = targetHour * 60 + targetMinute
    let offsetHours = (targetMinutes - utcMinutes) / 60

    if (offsetHours > 12) offsetHours -= 24
    if (offsetHours < -12) offsetHours += 24

    return offsetHours
  }

  // 匹配城市（筛选当地时间为目标时间的城市）
  const matchCities = (): City[] => {
    const targetOffset = calculateTargetOffset()

    return CITIES_DATA.filter(city => {
      const offsetDiff = Math.abs(city.offset - targetOffset)
      return offsetDiff <= 1  // 误差控制在 1 小时以内
    }).sort((a, b) => {
      // 按时差从小到大排序
      return Math.abs(a.offset - targetOffset) - Math.abs(b.offset - targetOffset)
    })
  }

  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
    // 保存到本地存储
    Taro.setStorageSync('selectedCity', city)
    Taro.setStorageSync('actualSleepTime', actualSleepTime)
    Taro.setStorageSync('idealSleepTime', idealSleepTime)
    Taro.redirectTo({ url: '/pages/time-travel/index' })
  }

  const matchedCities = matchCities()
  const matchTime = calculateMatchTime()

  return (
    <View className="city-select-page min-h-screen bg-slate-950 px-6 py-4">
      {/* 标题区 */}
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold block">找到精神时区</Text>
        <Text className="text-slate-400 text-base mt-2 block">
          为你推荐以下城市
        </Text>
      </View>

      {/* 目标时间 */}
      <View className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-lg border border-indigo-500/30 rounded-2xl p-6 mb-6 text-center">
        <Text className="text-slate-400 text-sm block">此时此刻，你的精神时区时间是</Text>
        <Text className="text-white text-5xl font-bold tracking-wider mt-2 block">
          {matchTime}
        </Text>
      </View>

      {/* 城市列表 */}
      <View>
        {matchedCities.length === 0 ? (
          <View className="text-center py-12">
            <Text className="text-slate-500 text-2xl mb-3 block">😔</Text>
            <Text className="text-slate-400 text-base block">没有找到匹配的城市</Text>
          </View>
        ) : (
          matchedCities.map((city) => (
            <View
              key={city.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-4 active:bg-slate-800"
              onClick={() => handleCitySelect(city)}
            >
              <View className="flex flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white text-xl font-semibold block">{city.name}</Text>
                  <Text className="text-slate-400 text-sm mt-1 block">{city.englishName}</Text>
                  <Text className="text-slate-500 text-xs mt-1 block">{city.timezone}</Text>
                </View>
                <View className="text-right">
                  <Text className="text-indigo-400 text-base block">→</Text>
                </View>
              </View>
              <View className="mt-3 pt-3 border-t border-slate-800">
                <Text className="text-slate-300 text-sm italic block">&ldquo;{city.recommendation}&rdquo;</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  )
}
