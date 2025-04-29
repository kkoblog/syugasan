import type { ZodiacSigns } from '../types';

export const zodiacSigns: ZodiacSigns = {
  Aries: {
    name: '牡羊座',
    symbol: '♈',
    element: '火',
    dateRange: '3月21日 - 4月19日',
    color: 'bg-purple-500',
    opposite: 'Libra'
  },
  Taurus: {
    name: '牡牛座',
    symbol: '♉',
    element: '土',
    dateRange: '4月20日 - 5月20日',
    color: 'bg-purple-500',
    opposite: 'Scorpio'
  },
  Gemini: {
    name: '双子座',
    symbol: '♊',
    element: '風',
    dateRange: '5月21日 - 6月20日',
    color: 'bg-purple-500',
    opposite: 'Sagittarius'
  },
  Cancer: {
    name: '蟹座',
    symbol: '♋',
    element: '水',
    dateRange: '6月21日 - 7月22日',
    color: 'bg-purple-500',
    opposite: 'Capricorn'
  },
  Leo: {
    name: '獅子座',
    symbol: '♌',
    element: '火',
    dateRange: '7月23日 - 8月22日',
    color: 'bg-purple-500',
    opposite: 'Aquarius'
  },
  Virgo: {
    name: '乙女座',
    symbol: '♍',
    element: '土',
    dateRange: '8月23日 - 9月22日',
    color: 'bg-purple-500',
    opposite: 'Pisces'
  },
  Libra: {
    name: '天秤座',
    symbol: '♎',
    element: '風',
    dateRange: '9月23日 - 10月22日',
    color: 'bg-purple-500',
    opposite: 'Aries'
  },
  Scorpio: {
    name: '蠍座',
    symbol: '♏',
    element: '水',
    dateRange: '10月23日 - 11月21日',
    color: 'bg-purple-500',
    opposite: 'Taurus'
  },
  Sagittarius: {
    name: '射手座',
    symbol: '♐',
    element: '火',
    dateRange: '11月22日 - 12月21日',
    color: 'bg-purple-500',
    opposite: 'Gemini'
  },
  Capricorn: {
    name: '山羊座',
    symbol: '♑',
    element: '土',
    dateRange: '12月22日 - 1月19日',
    color: 'bg-purple-500',
    opposite: 'Cancer'
  },
  Aquarius: {
    name: '水瓶座',
    symbol: '♒',
    element: '風',
    dateRange: '1月20日 - 2月18日',
    color: 'bg-purple-500',
    opposite: 'Leo'
  },
  Pisces: {
    name: '魚座',
    symbol: '♓',
    element: '水',
    dateRange: '2月19日 - 3月20日',
    color: 'bg-purple-500',
    opposite: 'Virgo'
  }
} as const;