# Chronos 设计指南

## 品牌定位

**应用名称**: Chronos（克罗诺斯 - 希腊神话中的时间之神）

**应用定位**: 精神时区切换工具，为熬夜与作息紊乱人群提供心理慰藉与身份认同

**设计风格**: 暗夜风格、科幻感、沉浸式体验、温暖治愈

**目标用户**: 熬夜人群、作息紊乱者、时差困难户

**核心情感**: 理解、陪伴、接纳、治愈

---

## 配色方案

### 主色板

- **主色调**: `bg-indigo-950` / `text-indigo-950` (#0f0524) - 深邃宇宙蓝
- **强调色**: `bg-indigo-500` / `text-indigo-500` (#6366f1) - 星际蓝紫
- **次强调色**: `bg-purple-500` / `text-purple-500` (#a855f7) - 星云紫

### 中性色

- **背景色**: `bg-slate-950` (#020617) - 深邃夜空
- **卡片背景**: `bg-slate-900/80` (#0f172a) - 半透明深色卡片
- **分割线**: `border-slate-800` (#1e293b)
- **次要文本**: `text-slate-400` (#94a3b8)

### 语义色

- **主要操作**: `bg-indigo-600` `hover:bg-indigo-700`
- **次要操作**: `bg-purple-600` `hover:bg-purple-700`
- **成功提示**: `text-emerald-400` (#34d399)
- **提示信息**: `text-slate-400`

### 渐变配色

- **主渐变**: `bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900`
- **卡片渐变**: `bg-gradient-to-br from-slate-900/90 to-slate-950/90`
- **文字渐变**: `bg-gradient-to-r from-indigo-400 to-purple-400` `text-transparent` `bg-clip-text`

---

## 字体规范

### 字体层级

- **H1 页面标题**: `text-3xl font-bold`
- **H2 区块标题**: `text-2xl font-semibold`
- **H3 卡片标题**: `text-xl font-semibold`
- **Body 正文**: `text-base`
- **Small 辅助文字**: `text-sm`
- **Caption 说明文字**: `text-xs`

### 字体颜色

- **主标题**: `text-white` 或 `bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text`
- **正文**: `text-slate-200`
- **次要信息**: `text-slate-400`

---

## 间距系统

### 页面边距

- **标准页面边距**: `px-6 py-4`
- **紧凑页面边距**: `px-4 py-3`

### 组件间距

- **页面区块间距**: `gap-6`
- **卡片内边距**: `p-5`
- **列表项间距**: `gap-4`
- **小元素间距**: `gap-2`

---

## 组件规范

### 按钮

**主要按钮**:
```tsx
<View className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-8 py-4">
  <Text className="text-white font-semibold text-base text-center block">开始时光之旅</Text>
</View>
```

**次要按钮**:
```tsx
<View className="bg-slate-800/80 border border-slate-700 rounded-2xl px-6 py-3">
  <Text className="text-slate-300 font-medium text-sm text-center block">取消</Text>
</View>
```

### 卡片

**基础卡片**:
```tsx
<View className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-lg border border-slate-800 rounded-2xl p-5">
  <Text className="text-white text-lg font-semibold block">卡片标题</Text>
</View>
```

**发光卡片**:
```tsx
<View className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-lg border border-indigo-500/30 rounded-2xl p-5 shadow-lg shadow-indigo-500/10">
  <Text className="text-white text-lg font-semibold block">发光卡片</Text>
</View>
```

### 输入框

**时间选择器容器**:
```tsx
<View className="bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-4">
  <Text className="text-slate-400 text-sm mb-2 block">选择时间</Text>
  <Text className="text-white text-2xl font-semibold block">23:00</Text>
</View>
```

### 列表项

**城市列表项**:
```tsx
<View className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-4">
  <View className="flex flex-row items-center justify-between">
    <View>
      <Text className="text-white text-xl font-semibold block">纽约</Text>
      <Text className="text-slate-400 text-sm block">UTC-5</Text>
    </View>
    <Text className="text-indigo-400 text-base block">→</Text>
  </View>
</View>
```

### 空状态

```tsx
<View className="flex flex-col items-center justify-center py-12">
  <Text className="text-slate-500 text-2xl mb-3 block">🌙</Text>
  <Text className="text-slate-400 text-base block">正在时光隧道中...</Text>
</View>
```

---

## 导航结构

**页面路由**:
1. `pages/index/index` - 时间选择页面
2. `pages/search-time/index` - 时光检索转场页面
3. `pages/city-select/index` - 城市选择页面
4. `pages/time-travel/index` - 时光穿梭转场页面
5. `pages/city-showcase/index` - 城市展示页面

**页面跳转规范**:
- 转场页面使用 `redirectTo`（不保留历史栈）
- 正常流程使用 `navigateTo`
- 状态使用全局 Store 管理（Zustand）

---

## 动效规范

### 转场动效

**时光检索（淡入淡出）**:
- 使用 Taro 内置淡入淡出过渡
- 时长: 800ms

**时光穿梭（滑动）**:
- 使用 Taro 内置滑动过渡
- 方向: 从左到右
- 时长: 1000ms

### 加载状态

**加载动画**:
```tsx
<View className="flex items-center justify-center py-8">
  <Text className="text-indigo-400 text-2xl block animate-pulse">🌙</Text>
  <Text className="text-slate-400 text-sm ml-3 block">时光流转中...</Text>
</View>
```

---

## 图片规范

### 图片资源

- **城市风景**: 使用高质量夜景图片
- **建议比例**: 16:9 或 3:2
- **圆角**: `rounded-2xl`
- **阴影**: `shadow-lg`

### 图片容器

```tsx
<View className="relative w-full h-64 rounded-2xl overflow-hidden mb-4">
  <Image
    src="https://images.unsplash.com/photo-151..."
    mode="aspectFill"
    className="w-full h-full"
  />
  <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4">
    <Text className="text-white text-lg font-semibold block">城市名称</Text>
  </View>
</View>
```

---

## 小程序约束

### 包体积控制

- 压缩图片资源
- 使用网络图片而非本地图片
- 避免大型第三方库

### 性能优化

- 图片懒加载
- 避免频繁状态更新
- 合理使用动画

### 跨端兼容

- 所有 `Text` 组件添加 `block` 类（H5 兼容）
- 使用 `View` 包裹 `Input`（样式兼容）
- 平台检测使用 `const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP`

---

## 特殊元素

### 诗意文案样式

```tsx
<View className="bg-slate-900/60 backdrop-blur-sm border-l-4 border-indigo-500 rounded-r-xl p-4 my-4">
  <Text className="text-slate-300 text-base italic block">
    "夜色中的巴黎，像一首未完成的诗，等待你的续写。"
  </Text>
</View>
```

### 时间显示样式

```tsx
<View className="flex flex-col items-center py-6">
  <Text className="text-slate-400 text-sm mb-2 block">当地时间</Text>
  <Text className="text-white text-5xl font-bold tracking-wider block">
    23:45
  </Text>
</View>
```

### 精神身份标签

```tsx
<View className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-4 py-2">
  <Text className="text-white text-sm font-medium block">精神巴黎人</Text>
</View>
```

---

## 设计原则

1. **暗夜为主**: 背景以深色为主，营造夜间氛围
2. **情感化设计**: 温暖的文案、柔和的色彩、治愈的元素
3. **沉浸式体验**: 流畅的动效、统一的视觉语言
4. **简洁至上**: 避免过度装饰，突出核心功能
5. **跨端一致**: 确保小程序和 H5 体验一致
