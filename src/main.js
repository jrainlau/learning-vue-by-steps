import observe from './observe.js'
import { bridge } from './utils.js'
import Compile from './compile.js'

export default function Euv (opts = {}) {
  this.$options = opts
  const data = this._data = this.$options.data

  observe(data)
  bridge(this, data)

  initComputed.call(this)
  new Compile(opts.el, this)

  opts.mounted && opts.mounted.call(this)
}

function initComputed () {
  const vm = this
  const computed = this.$options.computed

  Object.keys(computed).forEach((key) => {
    Object.defineProperty(vm, key, {
      get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
      set (newVal) {
        computed[key].set ? computed[key].set(newVal) : console.error('Computed 属性无法直接赋值！')
      }
    })
  })
}
