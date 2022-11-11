import Observer from './src/observer'
import utils from './src/utils'
import editPlugin from './src/plugins/edit'
import merge from 'deepmerge'

/*
配置
{
    el: Object, // 容器元素，dom元素或选择器字符串
    dbClickTime: 200,// 双击间隔事件，默认200ms
    mobile: false// 是否是移动端模式，默认false
}

事件
on(event, callback)，事件监听，CLICK、DOUBLE-CLICK、MOUSEDOWN、MOUSEMOVE、MOUSEUP、MOUSEENTER、MOUSELEAVE、WINDOW-CLICK
*/

// 默认配置
const defaultOpt = {
    dbClickTime: 200,
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-09-27 14:02:06 
 * @Desc: 标注库 
 */
class Markjs {
    static pluginList = []

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 10:27:23 
     * @Desc: 安装插件 
     */
    static use(plugin, index = -1) {
        if (!plugin) {
            return
        }
        if (plugin.used) {
            return this
        }
        plugin.used = true
        if (index === -1) {
            Markjs.pluginList.push(plugin)
        } else {
            Markjs.pluginList.splice(index, 0, plugin)
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 14:02:12 
     * @Desc: 构造函数 
     */
    constructor(opt = {}) {
        if (!opt.el) {
            throw new Error('el属性为空')
        }
        // 配置项
        this.opt = {
            ...defaultOpt,
            ...opt
        }
        // 容器元素
        this.el = this.originEl = typeof opt.el === 'string' ? document.querySelector(opt.el) : opt.el
        if (!this.el) {
            throw new Error('容器元素获取失败')
        }
        // 创建一个新的容器
        this.crateContainer()
        // 容器元素的尺寸信息
        this.elRectInfo = null
        // canvas元素
        this.canvasEle = null
        // 绘图元素尺寸信息
        this.canvasEleRectInfo = null
        // 绘图上下文
        this.ctx = null
        // 单击定时器
        this.clickTimer = null
        // 发布订阅对象
        this.observer = new Observer()
        // 鼠标按下的位置
        this.mousedownPos = {
            x: 0,
            y: 0
        }
        // 鼠标松开的位置
        this.mouseupPos = {
            x: 0,
            y: 0
        }
        // 鼠标上次点击的时间
        this.lastClickTime = 0

        // 固化事件函数的this
        this.bindEventCallback()
        // 初始化
        this.init()
        // 注册插件
        this.usePlugins()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2021-10-25 13:52:52 
     * @Desc: 更新配置 
     */
    updateOpt(newOpt) {
        this.opt = merge(this.opt, newOpt)
        this.emit('UPDATED_OPT', this.opt)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 10:35:33 
     * @Desc: 注册插件 
     */
    usePlugins() {
        let index = 0
        let len = Markjs.pluginList.length
        let loopUse = () => {
            if (index >= len) {
                this.emit('PLUGINS_LOADED')
                return
            }
            let cur = Markjs.pluginList[index]
            cur(this, utils).then(() => {
                index++
                loopUse()
            })
        }
        loopUse()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2021-10-25 14:03:12 
     * @Desc: 触发事件 
     */
    emit(event, ...args) {
        this.observer.publish(event, ...args)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 13:54:58 
     * @Desc: 监听事件 
     */
    on(event, callback) {
        return this.observer.subscribe(event, callback)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 13:56:06 
     * @Desc: 解除监听事件 
     */
    off(token) {
        this.observer.unsubscribe(token)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2022-07-14 09:38:12 
     * @Desc: 创建一个新的容器 
     */
    crateContainer() {
        let newEl = document.createElement('div')
        newEl.className = 'markjsContainer'
        newEl.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
        `
        this.el.style.overflow = 'hidden'
        this.el.appendChild(newEl)
        this.el = newEl
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 14:06:54 
     * @Desc: 初始化 
     */
    init() {
        this.createElement()
        this.ctx = this.canvasEle.getContext('2d')
        this.bindEvent()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:11:03 
     * @Desc: 销毁 
     */
    destroy() {
        this.unbindEvent()
        this.el.removeChild(this.canvasEle)
        this.emit('DESTORY')
        this.observer.clearAll()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 14:26:19 
     * @Desc: 创建元素 
     */
    createElement() {
        this.elRectInfo = this.el.getBoundingClientRect()
        let {
            width,
            height
        } = this.elRectInfo
        this.canvasEle = document.createElement('canvas')
        this.canvasEle.width = width
        this.canvasEle.height = height
        this.canvasEleRectInfo = {
            width,
            height
        }
        this.el.appendChild(this.canvasEle)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 16:55:53 
     * @Desc:  固化事件函数的this
     */
    bindEventCallback() {
        this.onclick = this.onclick.bind(this)
        this.onmousedown = this.onmousedown.bind(this)
        this.onmousemove = this.onmousemove.bind(this)
        this.onmouseup = this.onmouseup.bind(this)
        this.onmouseenter = this.onmouseenter.bind(this)
        this.onmouseleave = this.onmouseleave.bind(this)
        this.onWindowClick = this.onWindowClick.bind(this)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 14:55:12 
     * @Desc: 绑定事件 
     */
    bindEvent() {
        let isMobile = this.opt.mobile
        this.canvasEle.addEventListener('click', this.onclick)
        this.canvasEle.addEventListener(isMobile ? 'touchstart' : 'mousedown', this.onmousedown)
        this.canvasEle.addEventListener(isMobile ? 'touchmove' : 'mousemove', this.onmousemove)
        window.addEventListener(isMobile ? 'touchend' : 'mouseup', this.onmouseup)
        this.canvasEle.addEventListener('mouseenter', this.onmouseenter)
        this.canvasEle.addEventListener('mouseleave', this.onmouseleave)
        window.addEventListener('click', this.onWindowClick)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 14:57:23 
     * @Desc: 解绑事件 
     */
    unbindEvent() {
        let isMobile = this.opt.mobile
        this.canvasEle.removeEventListener('click', this.onclick)
        this.canvasEle.removeEventListener(isMobile ? 'touchstart' : 'mousedown', this.onmousedown)
        this.canvasEle.removeEventListener(isMobile ? 'touchmove' : 'mousemove', this.onmousemove)
        window.removeEventListener(isMobile ? 'touchend' : 'mouseup', this.onmouseup)
        this.canvasEle.removeEventListener('mouseenter', this.onmouseenter)
        this.canvasEle.removeEventListener('mouseleave', this.onmouseleave)
        window.removeEventListener('click', this.onWindowClick)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:04:50 
     * @Desc: 单击事件 
     */
    onclick(e) {
        if (this.clickTimer) {
            clearTimeout(this.clickTimer)
            this.clickTimer = null
        }

        this.clickTimer = setTimeout(() => {
            this.emit('CLICK', e)
        }, this.opt.dbClickTime);

        if (Date.now() - this.lastClickTime <= this.opt.dbClickTime) {
            clearTimeout(this.clickTimer)
            this.clickTimer = null
            this.lastClickTime = 0
            this.emit('DOUBLE-CLICK', e)
        }

        this.lastClickTime = Date.now()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:02:26 
     * @Desc: 鼠标按下事件 
     */
    onmousedown(e) {
        let mobileEvent = null
        if (this.opt.mobile) {
            mobileEvent = e
            e = e.touches[0]
        }
        this.mousedownPos = {
            x: e.clientX,
            y: e.clientY
        }
        this.emit('MOUSEDOWN', e, mobileEvent)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:02:26 
     * @Desc: 鼠标移动事件 
     */
    onmousemove(e) {
        let mobileEvent = null
        if (this.opt.mobile) {
            mobileEvent = e
            e = e.touches[0]
        }
        this.emit('MOUSEMOVE', e, mobileEvent)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:02:26 
     * @Desc: 鼠标松开事件 
     */
    onmouseup(e) {
        let mobileEvent = null
        if (this.opt.mobile) {
            mobileEvent = e
            e = e.touches[0]
        }
        if (!e) {
            e = {
                clientX: 0,
                clientY: 0
            }
        }
        this.mouseupPos = {
            x: e.clientX,
            y: e.clientY
        }
        this.emit('MOUSEUP', e, mobileEvent)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:05:29 
     * @Desc: 鼠标移入事件 
     */
    onmouseenter(e) {
        this.emit('MOUSEENTER', e)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:06:28 
     * @Desc: 鼠标移出事件 
     */
    onmouseleave(e) {
        this.emit('MOUSELEAVE', e)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:07:31 
     * @Desc: window的点击事件 
     */
    onWindowClick(e) {
        this.emit('WINDOW-CLICK', e)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:56:54 
     * @Desc: 清除画布 
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasEle.width, this.canvasEle.height)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 16:57:03 
     * @Desc: 鼠标坐标转为相对canvas的坐标 
     */
    toCanvasPos(e) {
        let cx = e.clientX
        let cy = e.clientY
        let {
            left,
            top,
            originWidth = width,
            originHeight = height
        } = this.canvasEle.getBoundingClientRect()
        // 响应父元素上添加的缩放比例
        const factorX = originWidth / this.canvasEle.offsetWidth;
        const factorY = originHeight / this.canvasEle.offsetHeight;
        let x = (cx - left) / factorX;
        let y = (cy - top) / factorY;
        return {
            x,
            y
        }
    }
}

Markjs.use(editPlugin)

export default Markjs
