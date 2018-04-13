import Watcher from './watcher.js'

export default function Compile (el, vm) {
  vm.$el = document.querySelector(el)
  const fragment = document.createDocumentFragment()

  let child
  while (child = vm.$el.firstChild) {
    fragment.appendChild(child)
  }

  function replace(frag) {
    Array.from(frag.childNodes).forEach(node => {
        const content = node.textContent
        const regx = /\{\{(.*?)\}\}/g
        
        // 只有文本节点且符合正则的才会被处理
        if (node.nodeType === 3 && regx.test(content)) {
          replaceText()

          function replaceText () {
            node.textContent = content.replace(regx, (matched, placeholder) => {
              // 通过watcher，对key进行消息订阅，赋值到Dep.target中
              // 每读取一次val[key]，就会触发一次对应的getter
              // 此时会把当前的key对应的watcher也就是Dep.target推进消息订阅队列当中
              new Watcher(vm, placeholder, replaceText)

              return placeholder.split('.').reduce((vm, key) => {
                return vm[key]
              }, vm)
            })
          }
        }

        // 针对e-model指令进行双向数据绑定
        if (node.nodeType === 1) {
          const nodeAttr = node.attributes
          Array.from(nodeAttr).forEach((attr) => {
            const attrName = attr.name
            const attrVal = attr.value

            if (attrName.includes('e-')) {
              node.value = vm[attrVal]
            }

            new Watcher(vm, RegExp.$1, (newVal) => {
              node.value = newVal
            })

            node.addEventListener('input', (e) => {
              const newVal = e.target.value
              // 相当于赋了一个新值
              // 而值的改变会调用set，set中又会调用notify，notify中调用watcher的update方法实现了更新
              vm[attrVal] = newVal
            })
          })
        }
        // 递归遍历
        if (node.childNodes && node.childNodes.length) {
          replace(node)
        }
    })
  }

  replace(fragment)

  vm.$el.appendChild(fragment)
}