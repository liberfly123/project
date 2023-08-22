import { Request } from '@/hooks/request'
import url from '../url'
import type { SPACE } from '@/namespace/animation'
import { toRef } from 'vue'

export async function getIndexDatas(propKey: string) {
  // 获取后台API
  const API = Reflect.get(<SPACE.urlObj>url.index, propKey)
  // 获取后台数据(不能返回axios对象，否则会类型报错)
  const datas = toRef(await Request.getData(API)).value.data
  return datas
}
