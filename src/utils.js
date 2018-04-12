export const bridge = (instance, dataObj) => {
  for (let key in dataObj) {
    Object.defineProperty(instance, key, {
      configurable: true,
      get () {
        return instance._data[key]
      },
      set (newVal) {
        instance._data[key] = newVal
      }
    })
  }
}
