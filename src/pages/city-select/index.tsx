import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useChronosStore, type City } from '@/stores/chronos'
import { CITIES_DATA } from '@/data/cities'
import './index.css'

export default function CitySelectPage() {
  const { actualSleepTime, idealSleepTime, setSelectedCity } = useChronosStore()

  // 计算匹配时间：目标时间 = 理想睡眠时间 - (实际睡眠时间 - 当前时间)
  const calculateMatchTime = (): string => {
    if (!actualSleepTime || !idealSleepTime) return '--:--'

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const [idealH, idealM] = idealSleepTime.split(':').map(Number)
    const [actualH, actualM] = actualSleepTime.split(':').map(Number)

    const idealTotalMinutes = idealH * 60 + idealM
    const actualTotalMinutes = actualH * 60 + actualM

    // 1. 计算当前时间距离实际睡眠时间还有多久
    // 如果实际睡眠时间小于当前时间（说明跨天了），需要加24小时
    let diffMinutes = actualTotalMinutes - currentMinutes
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60
    }
    
    // 2. 用理想睡眠时间减去这个差值，得到目标时间
    let targetTotalMinutes = idealTotalMinutes - diffMinutes
    
    // 处理跨天情况（可能是负数）
    while (targetTotalMinutes < 0) {
      targetTotalMinutes += 24 * 60
    }
    targetTotalMinutes = targetTotalMinutes % (24 * 60)

    const targetHour = Math.floor(targetTotalMinutes / 60)
    const targetMinute = targetTotalMinutes % 60

    return `${String(targetHour).padStart(2, '0')}:${String(targetMinute).padStart(2, '0')}`
  }

  // 计算目标城市的 UTC 偏移量
  const calculateTargetOffset = (): number => {
    const targetTimeStr = calculateMatchTime()
    if (targetTimeStr === '--:--') return 0

    // 获取当前 UTC 时间
    const now = new Date()
    const utcHours = now.getUTCHours()
    const utcMinutes = now.getUTCMinutes()
    const currentUtcTotalMinutes = utcHours * 60 + utcMinutes

    // 获取目标时间
    const [targetH, targetM] = targetTimeStr.split(':').map(Number)
    const targetTotalMinutes = targetH * 60 + targetM

    // 计算偏移量（以小时为单位）
    // 目标时间 - UTC时间 = 偏移量
    let offsetMinutes = targetTotalMinutes - currentUtcTotalMinutes
    
    // 处理跨天导致的偏移量异常
    // 偏移量范围通常在 -12 到 +14 之间
    let offsetHours = offsetMinutes / 60

    // 如果偏移量超过 12 小时，说明可能跨天了，尝试减去 24
    if (offsetHours > 12) {
      offsetHours -= 24
    }
    // 如果偏移量小于 -12 小时，说明可能跨天了，尝试加上 24
    else if (offsetHours < -12) {
      offsetHours += 24
    }

    return offsetHours
  }

  // 匹配城市（筛选当地时间为目标时间的城市）
  const matchCities = (): City[] => {
    // 这里的 offset 是目标时区相对于 UTC 的偏移量
    const targetOffset = calculateTargetOffset()
    
    // 获取所有城市并计算它们与目标偏移量的差距
    const citiesWithDiff = CITIES_DATA.map(city => {
      let diff = Math.abs(city.offset - targetOffset)
      // 处理跨越国际日期变更线的情况（如 -11 和 +13 其实只差 24 小时，是同一个时刻）
      if (diff > 12) {
        diff = Math.abs(24 - diff)
      }
      return { ...city, diff }
    })

    // 筛选误差在 0.17 小时（约10分钟）以内的城市，并按误差排序
    // 策略：优先寻找 10 分钟内的完美匹配。如果找不到，则放宽到 45 分钟以确保有结果。
    const strictMatches = citiesWithDiff
      .filter(city => city.diff <= 0.17)
      .sort((a, b) => a.diff - b.diff)

    if (strictMatches.length > 0) {
      return strictMatches
    }

    // 降级策略：寻找 45 分钟内的最近城市（标准时区通常间隔1小时，最大偏差为30分钟，0.75足够覆盖）
    return citiesWithDiff
      .filter(city => city.diff <= 0.75)
      .sort((a, b) => a.diff - b.diff)
      // 如果是降级匹配，只推荐最接近的前 5 个，避免推荐偏差太大的
      .slice(0, 5)
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
