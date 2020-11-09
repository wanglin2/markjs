import utils from '../utils'

/*
配置
{
    img: '',// 图片，必填
    elBg: '',// 容器的背景颜色
    bg: ''// 画布的背景颜色
}

属性

事件

方法
*/

// 默认配置
const defaultOpt = {
    elBg: '',
    bg: ''
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-22 10:29:50 
 * @Desc: 图片支持插件 
 * 根据图片自动缩放调整最终画布大小
 * 该插件需要安装到Edit插件之前，Markjs.use(imgPlugin, 0)
 */
export default function ImgPlugin(instance) {
    let _resolve = null
    let promise = new Promise((resolve) => {
        _resolve = resolve
    })
    let opt = {
        ...defaultOpt,
        ...instance.opt
    }
    if (!opt.img) {
        _resolve()
        return promise
    }
    // 容器尺寸信息
    let elRectInfo = instance.elRectInfo
    // 画布元素
    let canvasEle = instance.canvasEle
    // 图片要素canvas
    let imgCanvasEle = null
    // 图片对象
    let image = null
    // 图片实际宽高
    let imgActWidth = 0
    let imgActHeight = 0
    // 最终画布区域宽高
    let actEditWidth = 0
    let actEditHeight = 0
    // 最终渲染宽高与图片实际宽高的比例
    let ratio = 0

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-11-03 15:33:39 
     * @Desc: 销毁 
     */
    instance.on('DESTORY', () => {
        imgCanvasEle && instance.el.removeChild(imgCanvasEle)
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 14:33:06 
     * @Desc: 加载图片 
     */
    utils.loadImage(opt.img)
        .then((img) => {
            image = img
            imgActWidth = image.width
            imgActHeight = image.height
            init()
            _resolve()
        })
        .catch((e) => {
            instance.observer.publish('IMG-LOAD-ERROR', e)
            _resolve()
        })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 11:01:59 
     * @Desc: 初始化 
     */
    function init () {
        setSize()
        instance.canvasEleRectInfo = {
            width: actEditWidth,
            height: actEditHeight,
            left: (elRectInfo.width - actEditWidth) / 2,
            top: (elRectInfo.height - actEditHeight) / 2
        }
        setElStyle()
        setCanvasStyle(canvasEle, {
            zIndex: 2
        })
        drawImg()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 14:19:51 
     * @Desc: 计算缩放后的实际尺寸 
     */
    function setSize () {
        // 容器宽高都大于图片实际宽高，不需要缩放
        if (elRectInfo.width >= imgActWidth && elRectInfo.height >= imgActHeight) {
            ratio = 1
            actEditWidth = imgActWidth
            actEditHeight =imgActHeight
        } else {// 容器宽高有一个小于图片实际宽高，需要缩放
            let imgActRatio = imgActWidth / imgActHeight
            let elRatio = elRectInfo.width / elRectInfo.height
            if (elRatio > imgActRatio) {
                // 高度定死，宽度自适应
                ratio = imgActHeight / elRectInfo.height
                actEditWidth = imgActWidth / ratio
                actEditHeight = elRectInfo.height
            } else {
                // 宽度定死，高度自适应
                ratio = imgActWidth / elRectInfo.width
                actEditWidth = elRectInfo.width
                actEditHeight = imgActHeight / ratio
            }
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 14:21:56 
     * @Desc: 设置容器元素的样式 
     */
    function setElStyle() {
        let elPosition = window.getComputedStyle(instance.el).position
        if (elPosition === 'static') {
            instance.el.style.position = 'relative'
        }
        if (opt.elBg) {
            instance.el.style.background = opt.elBg
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 14:22:28 
     * @Desc: 设置画布元素的样式 
     */
    function setCanvasStyle(canvas, style = {}) {
        canvas.width = actEditWidth
        canvas.height = actEditHeight
        canvas.style.position = 'absolute'
        canvas.style.left = instance.canvasEleRectInfo.left + 'px'
        canvas.style.top = instance.canvasEleRectInfo.top + 'px'
        Object.keys(style).forEach((item) => {
            canvas.style[item] = style[item]
        })
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 14:25:21 
     * @Desc: 绘制图片 
     */
    function drawImg () {
        imgCanvasEle = document.createElement('canvas')
        let style = {
            zIndex: 1
        }
        if (opt.bg) {
            style.background = opt.bg
        }
        setCanvasStyle(imgCanvasEle, style)
        instance.el.appendChild(imgCanvasEle)
        let ctx = imgCanvasEle.getContext('2d')
        ctx.drawImage(image, 0, 0, actEditWidth, actEditHeight)
    }

    instance.image = image
    instance.ratio = ratio

    return promise
}