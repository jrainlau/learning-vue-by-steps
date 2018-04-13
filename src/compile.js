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
          const arr = RegExp.$1.split('.')
          // 浅复制，val的值被改变，vm也会被改变，从而可以递归遍历
          // eg: val = vm (此时为val与vm均为{ data: { child: { name: 'xxx' } }, info: { msg: 'hello' } })
          //     val = val[data] (此时val与vm均为{ child: { name: 'xxx' } })
          let val = vm
          arr.forEach(key => {
            val = val[key]
          })
          node.textContent = content.replace(regx, val).trim()

          // 通过watcher，对key进行消息订阅，赋值到Dep.target中
          // 每读取一次val[key]，就会触发一次对应的getter
          // 此时会把当前的key对应的watcher也就是Dep.target推进消息订阅队列当中
          new Watcher(vm, RegExp.$1, (newVal) => {
            node.textContent = content.replace(regx, newVal).trim()
          })
        }

        // 针对e-model指令进行双向数据绑定
        if (node.nodeType === 1) {
          console.log(node);
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
              // 相当于给this.c赋了一个新值
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