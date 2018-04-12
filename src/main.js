import observe from './observe.js'
import { bridge } from './utils.js'
import Compile from './compile.js'

export default function Euv (opts = {}) {
  this.$options = opts
  const data = this._data = this.$options.data

  observe(data)
  bridge(this, data)

  new Compile(opts.el, this)

  opts.mounted && opts.mounted.call(this)
}
