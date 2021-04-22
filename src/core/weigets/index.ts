



export class WeigetStore {
  stores = []

  regiester = (options: any, weiget: any) => {
    this.stores.push({
      ...options,
      weiget
    })
  }

  
  
}