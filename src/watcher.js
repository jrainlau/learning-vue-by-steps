import Dep from './dep.js'

export default class Watcher {
  constructor (vm, exp, fn) {
    this.vm = vm
    this.exp = exp
    this.fn = fn
    this._init()
  }

  _init () {
    console.log(`Init watcher by exp: ${this.exp}`);
    Dep.target = this
    const arr = this.exp.split('.')
    let val = this.vm
    arr.forEach((key) => {
      val = val[key]
    })
    Dep.target = null
  }

  update () {
    const arr = this.exp.split('.')
    let val = this.vm
    arr.forEach((key) => {
      val = val[key]
    })
    this.fn(val)
  }
}
