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

  // 计算时差（以小时为单位）
  const calculateTimeDiff = (time1: string, time2: string): number => {
    const [h1, m1] = time1.split(':').map(Number)
    const [h2, m2] = time2.split(':').map(Number)

    const minutes1 = h1 * 60 + m1
    const minutes2 = h2 * 60 + m2

    let diff = (minutes2 - minutes1) / 60

    // 处理跨天情况
    if (diff > 12) diff -= 24
    if (diff < -12) diff += 24

    return diff
  }

  // 计算匹配同路人的时间（新公式：理想睡眠时间 - (实际睡眠时间 - 当前时间)）
  const calculateMatchTime = (): number => {
    if (!actualSleepTime || !idealSleepTime || !currentTime) return 0

    // 计算距离实际睡眠时间还有多久
    const diffToActual = calculateTimeDiff(currentTime, actualSleepTime)

    // 计算匹配同路人的时间
    const matchTime = calculateTimeDiff(actualSleepTime, idealSleepTime) + diffToActual

    return matchTime
  }

  // 匹配城市（根据计算出的匹配时间）
  const matchCities = (): City[] => {
    const matchTime = calculateMatchTime()

    // 找到时差接近的城市（误差在 2 小时内）
    return CITIES_DATA.filter(city => {
      const offsetDiff = Math.abs(city.offset - matchTime)
      return offsetDiff <= 2
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
        <Text className="text-white text-3xl font-bold block">找到同路人</Text>
        <Text className="text-slate-400 text-base mt-2 block">
          根据你的实时作息，为你匹配了以下城市
        </Text>
      </View>

      {/* 时间计算说明 */}
      <View className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6">
        <Text className="text-white text-base font-semibold block">计算过程</Text>
        <View className="mt-3 space-y-2">
          <Text className="text-slate-300 text-sm block">
            当前时间：{currentTime}
          </Text>
          <Text className="text-slate-300 text-sm block">
            实际睡眠时间：{actualSleepTime}
          </Text>
          <Text className="text-slate-300 text-sm block">
            理想睡眠时间：{idealSleepTime}
          </Text>
          <View className="border-t border-slate-700 pt-2 mt-2">
            <Text className="text-indigo-400 text-sm block">
              匹配时间 = 理想睡眠时间 - (实际睡眠时间 - 当前时间)
            </Text>
            <Text className="text-white text-xl font-bold mt-2 block">
              {matchTime > 0 ? '+' : ''}{matchTime.toFixed(1)} 小时
            </Text>
          </View>
        </View>
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
