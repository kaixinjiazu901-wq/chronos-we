import { View, Text, Picker, Button } from '@tarojs/components'
import Taro, { useLoad, useShareAppMessage } from '@tarojs/taro'
import { useChronosStore } from '@/stores/chronos'
import './index.css'

export default function IndexPage() {
  const { actualSleepTime, idealSleepTime, setActualSleepTime, setIdealSleepTime, setSelectedCity } = useChronosStore()

  // 检测运行环境
  const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

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
      // 直接跳转到城市展示页面
      Taro.redirectTo({ url: '/pages/city-showcase/index' })
    }
  })

  // 分享到好友（仅小程序端）
  useShareAppMessage(() => {
    return {
      title: 'Chronos - 精神时区切换工具',
      path: '/pages/index/index',
      imageUrl: '' // 可选：自定义分享图片
    }
  })

  // H5 端复制链接分享
  const handleShareH5 = () => {
    const shareUrl = 'http://9.97.62.166:8888/chronos.html'
    Taro.setClipboardData({
      data: shareUrl,
      success: () => {
        Taro.showToast({
          title: '链接已复制，分享给朋友吧',
          icon: 'none'
        })
      }
    })
  }

  // 生成时间选项（00:00 - 23:45，每15分钟一个选项）
  const generateTimeOptions = (): string[] => {
    const options: string[] = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = String(h).padStart(2, '0')
        const minute = String(m).padStart(2, '0')
        options.push(`${hour}:${minute}`)
      }
    }
    return options
  }

  const timeOptions = generateTimeOptions()

  // 实际睡眠时间选择器
  const handleActualTimeChange = (e: any) => {
    const selectedTime = timeOptions[e.detail.value]
    setActualSleepTime(selectedTime)
  }

  // 理想睡眠时间选择器
  const handleIdealTimeChange = (e: any) => {
    const selectedTime = timeOptions[e.detail.value]
    setIdealSleepTime(selectedTime)
  }

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
          精神时区切换工具
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
            mode="selector"
            range={timeOptions}
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
            mode="selector"
            range={timeOptions}
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
      <View className="mt-4">
        <View
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-8 py-4 text-center active:opacity-80"
          onClick={handleStartJourney}
        >
          <Text className="text-white font-semibold text-base block">开始时光之旅</Text>
        </View>
      </View>

      {/* 分享按钮 */}
      <View className="mt-3">
        {isWeapp ? (
          <Button
            openType="share"
            className="bg-slate-800/80 rounded-2xl text-slate-400 text-sm py-3 px-4"
          >
            <Text className="text-slate-400 text-sm">🎁 分享给朋友</Text>
          </Button>
        ) : (
          <View
            className="bg-slate-800/80 rounded-2xl text-slate-400 text-sm py-3 px-4 text-center"
            onClick={handleShareH5}
          >
            <Text className="text-slate-400 text-sm">🎁 复制链接分享</Text>
          </View>
        )}
      </View>

      {/* 底部提示 */}
      <View className="mt-4 text-center">
        <Text className="text-slate-500 text-xs block">
          找到同路人，减少压力
        </Text>
      </View>
    </View>
  )
}
