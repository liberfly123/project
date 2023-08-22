// 命名空间
// 首页动画
export namespace SPACE {
  // 接口
  export interface urlObj {
    // 签名：[propName:string]，可以接受自定义名称（key）
    [propName: string]: string
  }
  export interface Url {
    // 自定义名字：值为 urlobj 接口 格式的对象，或字符串
    [propName: string]: urlObj | string
  }
  export interface NavLis {
    item: string
    isEnter: boolean
  }
}
