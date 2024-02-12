import { CustomRadioImgData } from 'src/views/components/custom-radio/types'
import { RoomType } from './types'

export const designStyle: CustomRadioImgData[] = [
  {
    img: '/images/styles/design/1neoclassic5403.jpg',
    isSelected: true,
    value: '((scandinavian)) style',
    title: 'スカンジナビア',
    styleId: 0
  },
  {
    img: '/images/styles/design/2modern07a7.jpg',
    value: '((modern)) style',
    title: 'モダン',
    styleId: 1
  },
  {
    img: '/images/styles/design/3minimalist07a7.jpg',
    value: 'mid ((century)) style',
    title: 'ミッドセンチュリー',
    styleId: 2
  },
  {
    img: '/images/styles/design/4medievalbeff.jpg',
    value: '((oriental)) style',
    title: 'オリエンタル',
    styleId: 3
  },
  {
    img: '/images/styles/design/5maximalistd690.jpg',
    value: '((ethnic)) style',
    title: 'エスニック',
    styleId: 4
  },
  {
    img: '/images/styles/design/6art-deco07a7.jpg',
    value: '((industrial)) style',
    title: 'インダストリアル',
    styleId: 5
  },
  {
    img: '/images/styles/design/7coastald86b.jpg',
    value: '((natural)) style',
    title: 'ナチュラル',
    styleId: 6
  },
  {
    img: '/images/styles/design/8rustic7922.jpg',
    value: '((art deco)) style',
    title: 'アールデコ',
    styleId: 7
  },
  {
    img: '/images/styles/design/9ski-chalet6e0a.jpg',
    value: '((country)) style',
    title: 'カントリー',
    styleId: 8
  },
  {
    img: '/images/styles/design/10tribal07a7.jpg',
    value: '((Japanese)) style',
    title: '和モダン',
    styleId: 9
  },
  {
    img: '/images/styles/design/11tropical07a7.jpg',
    value: '((bohemian)) style',
    title: 'ボヘミアン',
    styleId: 10
  },
  {
    img: '/images/styles/design/12vintage40f5.jpg',
    value: '((simple)) style',
    title: 'シンプル',
    styleId: 11
  },
  {
    img: '/images/styles/design/13zen5403.jpg',
    value: '((vintage)) style',
    title: 'ビンテージ',
    styleId: 12
  }
]

export const roomNameList: RoomType[] = [
  { title: 'リビング', value: '(((living))) room', nameId: 0 },
  {
    title: 'バスルーム',
    value: '(((bathroom))) without toilet',
    nameId: 1
  },
  {
    title: 'キッチン',
    value: '(((kitchen)))',
    nameId: 2
  },
  {
    title: 'ベッドルーム',
    value: '(((bedroom)))',
    nameId: 3
  },
  {
    title: 'ダイニング',
    value: '(((diningroom)))',
    nameId: 4
  },
  { title: 'トイレ coming soon', value: 'washroom with toilet only', nameId: 5 },
  {
    title: 'ホームオフィス',
    value: '(((computer office)))',
    nameId: 6
  }
]
