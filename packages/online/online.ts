import Axios from 'axios'
import { getAccountList } from './getAccountList'
import { getFavico } from './getFavico'
import { getImage, getImageList } from './getImages'
import { getTransactions } from './getTransactions'

export const online = {
  CancelToken: Axios.CancelToken,
  isCancel: Axios.isCancel,

  getFavico,
  getImage,
  getImageList,

  getAccountList,
  getTransactions,
}

export type Online = typeof online
