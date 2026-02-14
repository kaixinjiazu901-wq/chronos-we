import { View, Text } from '@tarojs/components'
import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.css'

export default function SearchTimePage() {
  useEffect(() => {
    // 自动跳转到城市选择页面
    const timer = setTimeout(() => {
      Taro.redirectTo({ url: '/pages/city-select/index' })
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View className="search-time-page min-h-screen bg-slate-950 flex items-center justify-center">
      <View className="text-center">
        <Text className="text-6xl mb-6 block animate-pulse">🔍</Text>
        <Text className="text-white text-xl font-semibold block">时光检索中...</Text>
        <Text className="text-slate-400 text-sm mt-2 block">正在寻找属于你的精神时区</Text>
      </View>
    </View>
  )
}
