/*
配置
{
    order: {
        color: '#fff',// 序号颜色
        background: '#2196F3',// 序号背景颜色
        fontSize: 24,// 序号字号
        width: 48,// 序号的宽高
        class: ''// 自定义css类名，设置了这个就不会设置如何样式，都需要你自己来设置
    }
}
*/

const defaultOpt = {
    color: '#fff',
    background: '#2196F3',
    fontSize: 24,
    width: 48,
    class: ''
}

/**
 * javascript comment
 * @Author: 王林25
 * @Date: 2020-11-02 20:09:14
 * @Desc: markjs标注对象编号插件
 */
export default function OrderPlugin(instance) {
    let _resolve = null
    let promise = new Promise((resolve) => {
        _resolve = resolve
    })
    let opt = {
        ...defaultOpt,
        ...(instance.opt.order || {})
    }
    let orderEls = []

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-11-03 15:33:39 
     * @Desc: 销毁 
     */
    instance.on('DESTORY', () => {
        clear()
    })

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:34:47
     * @Desc: 计算标注边界
     */
    function getBoundary(arr) {
        let minx = 999999
        let miny = 999999
        let maxx = -99999
        let maxy = -99999
        arr.forEach((item) => {
            if (item.x < minx) {
                minx = item.x
            }
            if (item.x > maxx) {
                maxx = item.x
            }
            if (item.y < miny) {
                miny = item.y
            }
            if (item.y > maxy) {
                maxy = item.y
            }
        })
        return {
            minx,
            miny,
            maxx,
            maxy
        }
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:34:57
     * @Desc: 计算边界中心点
     */
    function getBoundaryCenter({
        minx,
        miny,
        maxx,
        maxy
    }) {
        return {
            x: (maxx - minx) / 2 + minx,
            y: (maxy - miny) / 2 + miny
        }
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:35:04
     * @Desc: 设置容器元素样式
     */
    function setElStyle() {
        let elPosition = window.getComputedStyle(instance.el).position
        if (elPosition === 'static') {
            instance.el.style.position = 'relative'
        }
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:35:16
     * @Desc: 创建序号元素
     */
    function createEle(text = '', left, top) {
        left += (instance.canvasEleRectInfo.left || 0)
        top += (instance.canvasEleRectInfo.top || 0)
        let div = document.createElement('div')
        if (opt.class) {
            div.style.cssText = `position:absolute;left:${left}px;top:${top}px;z-index:3;user-select: none;pointer-events: none;transform: translate(-50%, -50%);`
            div.className = opt.class
        } else {
            div.style.cssText = `position:absolute;left:${left}px;top:${top}px;z-index:3;user-select: none;pointer-events: none;transform: translate(-50%, -50%);width:${opt.width}px;height:${opt.width}px;background: ${opt.background};font-family: MicrosoftYaHeiUI;font-size: ${opt.fontSize}px;color: ${opt.color};letter-spacing: 0;display:flex;justify-content:center;align-items: center;border-radius:50%`
        }
        div.innerHTML = text
        orderEls.push(div)
        instance.el.appendChild(div)
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:35:26
     * @Desc: 渲染一个序号
     */
    function renderOrder(item, index) {
        item.order = index
        let boundary = getBoundary(item.pointArr)
        let center = getBoundaryCenter(boundary)
        createEle(index + 1, center.x, center.y)
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:35:32
     * @Desc: 清除全部序号
     */
    function clear() {
        orderEls.forEach((item) => {
            instance.el.removeChild(item)
        })
        orderEls = []
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 10:58:27
     * @Desc: 删除某个指定的序号
     */
    function deleteOne(index) {
        if (index === undefined) {
            return
        }
        let div = orderEls.splice(index, 1)[0]
        div && instance.el.removeChild(div)
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:35:40
     * @Desc: 渲染序号
     */
    function showOrder() {
        clear()
        instance.getState().markItemList.forEach((item, index) => {
            renderOrder(item, index)
        })
    }
    setElStyle()
    showOrder()

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:39:32
     * @Desc: 当前激活元素变化
     */
    instance.on('CURRENT-MARK-ITEM-CHANGE', (item) => {
        if (item) {
            if (instance.opt.single) {
                clear()
            } else {
                showOrder()
                deleteOne(item.order)
            }
        } else {
            showOrder()
        }
    })

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 09:39:48
     * @Desc: 当前创建状态变化
     */
    instance.on('IS-CREATE-MARKING-CHANGE', (state) => {
        if (state) {
            if (instance.opt.single) {
                clear()
            }
        }
    })

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-11-03 10:17:25
     * @Desc: 标注删除事件
     */
    instance.on('DELETE-MARKING-ITEM', () => {
        showOrder()
    })

    _resolve()

    return promise
}