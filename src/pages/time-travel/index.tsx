import { View, Text } from '@tarojs/components'
import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.css'

export default function TimeTravelPage() {
  useEffect(() => {
    // 自动跳转到城市展示页面
    const timer = setTimeout(() => {
      Taro.redirectTo({ url: '/pages/city-showcase/index' })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View className="time-travel-page min-h-screen bg-slate-950 flex items-center justify-center">
      <View className="text-center">
        <Text className="text-6xl mb-6 block">🚀</Text>
        <Text className="text-white text-xl font-semibold block">时光穿梭中...</Text>
        <Text className="text-slate-400 text-sm mt-2 block">即将抵达你的精神国度</Text>
      </View>
    </View>
  )
}
