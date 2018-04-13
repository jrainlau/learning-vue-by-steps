import Dep from './dep.js'

export default class Watcher {
  constructor (vm, exp, fn) {
    this.vm = vm
    this.exp = exp
    this.fn = fn
    this._init()
  }

  _getNewVal () {
    const arr = this.exp.split('.')
    let val = this.vm
    // 会触发getter
    arr.forEach((key) => {
      val = val[key]
    })
    return val
  }

  _init () {
    // 触发对应属性的getter
    // getter会把this赋值给Dep.target，然后推入订阅数组当中
    // 搞定之后清空Dep.target
    Dep.target = this
    this._getNewVal()
    Dep.target = null
  }

  update () {
    this.fn(this._getNewVal())
  }
}
