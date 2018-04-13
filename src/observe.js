import Dep from './dep.js'

function Observe (data) {
  const dep = new Dep()
  for (let key in data) {
    let val = data[key]
    observe(val)
    Object.defineProperty(data, key, {
      configurable: true,
      get () {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newVal) {
        if (val === newVal) return
        val = newVal
        observe(newVal)
        dep.notify()
      }
    })
  }
}

export default function observe(data) {
  if (!data || typeof data !== 'object') return
  return new Observe(data)
}
