import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useChronosStore, type City } from '@/stores/chronos'
import { CITIES_DATA } from '@/data/cities'
import './index.css'

export default function CitySelectPage() {
  const { actualSleepTime, idealSleepTime, setSelectedCity } = useChronosStore()

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

  // 匹配城市（根据时差）
  const matchCities = (): City[] => {
    const timeDiff = calculateTimeDiff(actualSleepTime, idealSleepTime)

    // 找到时差接近的城市（误差在 2 小时内）
    return CITIES_DATA.filter(city => {
      const offsetDiff = Math.abs(city.offset - timeDiff)
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

  return (
    <View className="city-select-page min-h-screen bg-slate-950 px-6 py-4">
      {/* 标题区 */}
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold block">找到同路人</Text>
        <Text className="text-slate-400 text-base mt-2 block">
          根据你的作息时差，为你匹配了以下城市
        </Text>
      </View>

      {/* 时差显示 */}
      <View className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 mb-6">
        <Text className="text-white text-base block">你的时差</Text>
        <Text className="text-white text-4xl font-bold mt-2 block">
          {calculateTimeDiff(actualSleepTime, idealSleepTime) > 0 ? '+' : ''}
          {calculateTimeDiff(actualSleepTime, idealSleepTime).toFixed(1)} 小时
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
