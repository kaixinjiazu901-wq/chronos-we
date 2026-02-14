import { City } from '@/stores/chronos'

export const CITIES_DATA: City[] = [
  {
    id: 'new-york',
    name: '纽约',
    englishName: 'New York',
    timezone: 'UTC-5',
    offset: -5,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    recommendation: '在不夜城，你的深夜才刚刚开始',
    poeticLine: '纽约的霓虹灯火，永不落幕，就像你心中那团不灭的火焰。',
    weatherIcon: '🌙'
  },
  {
    id: 'london',
    name: '伦敦',
    englishName: 'London',
    timezone: 'UTC+0',
    offset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    recommendation: '雾都的深夜，适合思考与独处',
    poeticLine: '伦敦的夜雾里，藏着无数个未眠的灵魂，和你的故事。',
    weatherIcon: '🌙'
  },
  {
    id: 'paris',
    name: '巴黎',
    englishName: 'Paris',
    timezone: 'UTC+1',
    offset: 1,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    recommendation: '在光之城，深夜也是一种浪漫',
    poeticLine: '夜色中的巴黎，像一首未完成的诗，等待你的续写。',
    weatherIcon: '🌙'
  },
  {
    id: 'tokyo',
    name: '东京',
    englishName: 'Tokyo',
    timezone: 'UTC+9',
    offset: 9,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    recommendation: '在东京，你的深夜是最有活力的时刻',
    poeticLine: '东京的夜晚永不沉睡，霓虹灯下，你找到了属于自己的节奏。',
    weatherIcon: '🌙'
  },
  {
    id: 'sydney',
    name: '悉尼',
    englishName: 'Sydney',
    timezone: 'UTC+11',
    offset: 11,
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    recommendation: '南半球的星空，陪你度过每个深夜',
    poeticLine: '悉尼的歌剧院在月光下沉睡，而你，在星光中清醒。',
    weatherIcon: '🌙'
  },
  {
    id: 'dubai',
    name: '迪拜',
    englishName: 'Dubai',
    timezone: 'UTC+4',
    offset: 4,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    recommendation: '沙漠明珠的夜空，照亮你的梦想',
    poeticLine: '迪拜的摩天大楼刺破夜空，你的梦想也触手可及。',
    weatherIcon: '🌙'
  },
  {
    id: 'moscow',
    name: '莫斯科',
    englishName: 'Moscow',
    timezone: 'UTC+3',
    offset: 3,
    imageUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800',
    recommendation: '红场的夜晚，见证不羁的灵魂',
    poeticLine: '莫斯科的红星在夜空中闪烁，照亮你前行的路。',
    weatherIcon: '🌙'
  },
  {
    id: 'reykjavik',
    name: '雷克雅未克',
    englishName: 'Reykjavik',
    timezone: 'UTC+0',
    offset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800',
    recommendation: '极光之国，你的夜晚比白天更精彩',
    poeticLine: '雷克雅未克的夜空，或许能让你遇见极光，也遇见真实的自己。',
    weatherIcon: '🌌'
  },
  {
    id: 'berlin',
    name: '柏林',
    englishName: 'Berlin',
    timezone: 'UTC+1',
    offset: 1,
    imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
    recommendation: '艺术之都的深夜，灵感迸发',
    poeticLine: '柏林的夜色里，每个角落都藏着艺术的灵感，等待你的发现。',
    weatherIcon: '🌙'
  },
  {
    id: 'singapore',
    name: '新加坡',
    englishName: 'Singapore',
    timezone: 'UTC+8',
    offset: 8,
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    recommendation: '花园城市，夜晚也生机勃勃',
    poeticLine: '新加坡的夜晚不眠，就像你心中那份永不停歇的热爱。',
    weatherIcon: '🌙'
  },
  {
    id: 'bangkok',
    name: '曼谷',
    englishName: 'Bangkok',
    timezone: 'UTC+7',
    offset: 7,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
    recommendation: '天使之城，夜市灯火通明',
    poeticLine: '曼谷的夜市里，烟火与星光交织，照亮你前行的路。',
    weatherIcon: '🌙'
  },
  {
    id: 'dhaka',
    name: '达卡',
    englishName: 'Dhaka',
    timezone: 'UTC+6',
    offset: 6,
    imageUrl: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800',
    recommendation: '南亚门户，夜晚别有风情',
    poeticLine: '达卡的夜色中，古老的文明与现代生活交织。',
    weatherIcon: '🌙'
  },
  {
    id: 'islamabad',
    name: '伊斯兰堡',
    englishName: 'Islamabad',
    timezone: 'UTC+5',
    offset: 5,
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    recommendation: '山地之都，夜空纯净如洗',
    poeticLine: '伊斯兰堡的群山下，星空为你点亮希望的灯塔。',
    weatherIcon: '🌙'
  },
  {
    id: 'delhi',
    name: '德里',
    englishName: 'Delhi',
    timezone: 'UTC+5.5',
    offset: 5.5,
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    recommendation: '古老首都，夜色中历史流淌',
    poeticLine: '德里的月光下，千年的历史与你的梦想共鸣。',
    weatherIcon: '🌙'
  },
  {
    id: 'cairo',
    name: '开罗',
    englishName: 'Cairo',
    timezone: 'UTC+2',
    offset: 2,
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800',
    recommendation: '尼罗河畔，金字塔的夜',
    poeticLine: '开罗的金字塔在月光下沉默，见证你坚持的每一个深夜。',
    weatherIcon: '🌙'
  },
  {
    id: 'athens',
    name: '雅典',
    englishName: 'Athens',
    timezone: 'UTC+2',
    offset: 2,
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800',
    recommendation: '文明摇篮，夜晚思绪飞扬',
    poeticLine: '雅典的夜空中，古老的智慧与你同在。',
    weatherIcon: '🌙'
  },
  {
    id: 'dublin',
    name: '都柏林',
    englishName: 'Dublin',
    timezone: 'UTC+0',
    offset: 0,
    imageUrl: 'https://images.unsplash.com/photo-1598176377627-f8eb862a17f6?w=800',
    recommendation: '翡翠岛国，夜晚诗意盎然',
    poeticLine: '都柏林的夜风里，有诗人为你吟唱不眠的歌。',
    weatherIcon: '🌙'
  }
]
