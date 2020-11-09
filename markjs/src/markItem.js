import utils from './utils'

/*
// 配置
{
    data: null,// 附加数据，可以添加你需要的任何数据
    lineType: 'line',线段类型，line（普通线段）、borderLine（带边框的线段）、custom（自定义绘图方法）
    customRenderLine(this){},// 自定义绘制线段的方法
    strokeStyle: {// 标注轮廓样式
        lineWidth: 3,
        strokeColor: 'rgba(0, 136, 255, 1)',
        lineJoin: 'round',
        // 如果lineType为borderLine，需要配置一下三个属性
        frontLineWidth: 3,
        frontStrokeColor: 'rgba(0, 136, 255, 1)',
        frontLineJoin: 'round'
    },
    fillColor: 'rgba(0, 136, 255, 0.5)',// 标注区域填充颜色
    pointStyle: {// 端点的样式
        lineWidth: 3,
        strokeColor: 'rgba(0, 136, 255, 1)',
        fillColor: 'rgba(0, 136, 255, 0.5)'
    },
    pointArr: [// 回显的标注区域数据
        {
            data: null,//附加数据
            pointArr: [{// 点位数据
                {"x":0,"y":0}
            }],
            strokeStyle: {},
            fillColor: '',
            pointStyle:{}
        }
    ]
}


*/

// 默认的线条样式
const defaultStrokeStyle = {
    lineWidth: 3,
    strokeColor: 'rgba(0, 136, 255, 1)',
    lineJoin: 'round',
    frontLineWidth: 3,
    frontStrokeColor: 'rgba(0, 136, 255, 1)',
    frontLineJoin: 'round'
}
// 默认填充样式
const defaultFillColor = 'rgba(0, 136, 255, 0.5)'
// 默认的端点样式
const defaultPointStyle = {
    lineWidth: 3,
    strokeColor: 'rgba(0, 136, 255, 1)',
    fillColor: 'rgba(0, 136, 255, 0.5)'
}
// 默认配置
const defaultOpt = {
    showPoint: true,
    pointType: 'square',
    pointWidth: 3,
    lineType: 'line'
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-09-27 15:12:17 
 * @Desc: 单个标注对象 
 */
export default class MarkItem {
    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:12:11 
     * @Desc: 构造函数 
     */
    constructor(ctx = null, opt = {}) {
        // canvas上下文
        this.ctx = ctx
        // 配置
        this.opt = {
            ...defaultOpt,
            ...opt
        }
        // 附加数据
        this.data = opt.data || null
        // 线段绘制样式
        this.strokeStyle = opt.strokeStyle ? {
            ...defaultStrokeStyle,
            ...opt.strokeStyle
        } : defaultStrokeStyle
        // 填充样式
        this.fillColor = opt.fillColor || defaultFillColor
        // 端点样式
        this.pointStyle = opt.pointStyle ? {
            ...defaultPointStyle,
            ...opt.pointStyle
        } : defaultPointStyle
        // 点位数组{x,y}
        this.pointArr = opt.pointArr || []
        // 自定义更新端点位置的方法
        this.updatePointFn = opt.updatePoint
        // 路径是否已经闭合了
        this.isClosePath = false
        // 是否是编辑状态
        this.isEditing = false
        // 是否是拖动状态
        this.isDragging = false
        // 拖动的端点索引，没有则代表拖拽整体
        this.dragPointIndex = -1
        // 点位数组缓存，用于整体拖动
        this.dragCachePointArr = []
        // 鼠标滑过显示可选择状态
        this.hoverActive = false
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 15:17:35 
     * @Desc: 开启编辑 
     */
    enable() {
        this.isEditing = true
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 15:17:53 
     * @Desc: 结束编辑 
     */
    disable() {
        this.isEditing = false
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:24:50 
     * @Desc: 端点数量 
     */
    getPointLength() {
        return this.pointArr.length
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:54:50 
     * @Desc: 添加端点 
     */
    pushPoint(x, y) {
        if (!this.isEditing || this.isClosePath) {
            return
        }
        this.pointArr.push({
            x,
            y
        })
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-11-05 10:41:36 
     * @Desc: 删除某个顶点 
     */
    removePoint(index) {
        this.pointArr.splice(index, 1)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:57:47 
     * @Desc: 渲染 
     */
    render() {
        // 填充区域
        if (this.isClosePath) {
            this.renderArea()
        }
        // 绘制线段
        if (this.opt.lineType === 'custom') {
            this.opt.customRenderLine && this.opt.customRenderLine(this)
        } else if (this.opt.lineType === 'borderLine') {
            this.renderLines(this.strokeStyle)
            this.renderLines({
                ...this.strokeStyle,
                lineWidth: this.strokeStyle.frontLineWidth,
                strokeColor: this.strokeStyle.frontStrokeColor,
                lineJoin: this.strokeStyle.frontLineJoin
            })
        } else {
            this.renderLines(this.strokeStyle)
        }
        // 绘制端点
        this.renderPoints()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 17:04:16 
     * @Desc:  填充区域
     */
    renderArea() {
        this.ctx.save()
        this.ctx.fillStyle = this.fillColor
        this.ctx.beginPath()
        for (let i = 0; i < this.pointArr.length; i++) {
            let x = this.pointArr[i].x
            let y = this.pointArr[i].y
            if (i === 0) {
                this.ctx.moveTo(x, y)
            } else {
                this.ctx.lineTo(x, y)
            }
        }
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.restore()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:16:37 
     * @Desc: 绘制线段 
     */
    renderLines({
        lineWidth,
        strokeColor,
        lineJoin
    }, onlyPath) {
        this.ctx.save()
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = strokeColor
        this.ctx.lineJoin = lineJoin
        this.ctx.beginPath()
        for (let i = 0; i < this.pointArr.length; i++) {
            let x = this.pointArr[i].x
            let y = this.pointArr[i].y
            if (i === 0) {
                this.ctx.moveTo(x, y)
            } else {
                this.ctx.lineTo(x, y)
            }
        }
        // 闭合路径
        if (this.isClosePath) {
            this.ctx.closePath()
        }
        // 不实际绘制出来
        if (!onlyPath) {
            this.ctx.stroke()
        }
        this.ctx.restore()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 17:54:18 
     * @Desc:  绘制端点
     */
    renderPoints(onlyPath, callback) {
        for (let i = 0; i < this.pointArr.length; i++) {
            this.ctx.beginPath()
            let x = this.pointArr[i].x
            let y = this.pointArr[i].y
            if (this.isEditing || onlyPath || this.hoverActive) {
                this.drawPoint(x, y, onlyPath)
                callback && callback(i)
            }
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 17:57:19 
     * @Desc: 绘制点 
     */
    drawPoint(x, y, onlyPath) {
        let {
            customRenderPoint,
            showPoint,
            pointType,
            pointWidth
        } = this.opt
        // 用户自定义绘制端点方法
        if (customRenderPoint) {
            customRenderPoint(this.ctx, x, y, onlyPath, this.pointStyle)
        } else { // 预定义绘制端点方法
            this.ctx.save()
            this.ctx.lineWidth = this.pointStyle.lineWidth
            this.ctx.strokeStyle = this.pointStyle.strokeColor
            this.ctx.fillStyle = this.pointStyle.fillColor
            switch (pointType) {
                case 'square':
                    this.ctx.rect(x - pointWidth, y - pointWidth, pointWidth * 2, pointWidth * 2)
                    break;
                case 'circle':
                    this.ctx.arc(x, y, pointWidth * 2, 0, 2 * Math.PI)
                    break;
                default:
                    break;
            }
            // 不实际绘制出来
            if (!onlyPath) {
                if (showPoint) {
                    this.ctx.fill()
                    this.ctx.stroke()
                }
            }
            this.ctx.restore()
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:14:29 
     * @Desc: 检测某个点是否在该路径内 
     */
    checkInPath(x, y) {
        this.renderLines(this.strokeStyle, true)
        return this.ctx.isPointInPath(x, y)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 15:48:51 
     * @Desc: 判断某个点是否在某个端点内 
     */
    checkInPoints(x, y) {
        let index = -1
        this.renderPoints(true, (i) => {
            if (this.ctx.isPointInPath(x, y)) {
                index = i
            }
        })
        return index
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:23:34 
     * @Desc: 闭合路径 
     */
    closePath() {
        this.isClosePath = true
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 16:54:34 
     * @Desc: 允许拖动
     */
    enableDrag(pointIndex = -1) {
        this.isDragging = true
        this.dragPointIndex = pointIndex
        this.dragCachePointArr = JSON.parse(JSON.stringify(this.pointArr))
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 18:33:02 
     * @Desc: 停止拖动 
     */
    disableDrag() {
        this.isDragging = false
        this.dragPointIndex = -1
        this.dragCachePointArr = []
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 17:04:23 
     * @Desc: 拖动某个端点
     */
    dragPoint(x, y) {
        if (!this.isDragging || this.dragPointIndex === -1) {
            return
        }
        if (this.updatePointFn) {
            this.updatePointFn(this, x, y)
        } else {
            this.pointArr.splice(this.dragPointIndex, 1, {
                x,
                y
            })
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 17:04:32 
     * @Desc: 拖动整体 
     */
    dragAll(ox, oy) {
        if (!this.isDragging) {
            return
        }
        this.pointArr = this.dragCachePointArr.map((item) => {
            return {
                x: item.x + ox,
                y: item.y + oy
            }
        })
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 19:13:34 
     * @Desc: 显示鼠标滑过时可选择状态
     */
    enableHoverActive() {
        this.hoverActive = true
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 19:14:02 
     * @Desc: 关闭鼠标滑过时可选择状态
     */
    disableHoverActive() {
        this.hoverActive = false
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 20:23:44 
     * @Desc: 遍历检查线段是否存在交叉情况 
     */
    checkLineSegmentCross() {
        if (!this.checkCrossPrevCheck()) {
            return false
        }
        // 已存在的线段
        let lineSegments = this.createLineSegments(true)
        let len = lineSegments.length
        let cross = false
        for (let i = 0; i < len; i++) {
            let item = lineSegments[i]
            if (this.checkCrossWithLineSegments(item[0], item[1], true)) {
                cross = true
            }
        }
        return cross
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 09:36:33 
     * @Desc: 检查即将形成的线段是否会存在交叉 
     */
    checkNextLineSegmentCross(x, y) {
        if (!this.checkCrossPrevCheck()) {
            return false
        }
        let arr = this.pointArr
        let len = arr.length
        // 即将形成的线段
        let c = {
            x,
            y
        }
        let d = arr[len - 1]
        return this.checkCrossWithLineSegments(c, d)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 09:37:07 
     * @Desc: 检查最后的闭合线段是否会存在交叉 
     */
    checkEndLineSegmentCross() {
        if (!this.checkCrossPrevCheck()) {
            return false
        }
        let arr = this.pointArr
        let len = arr.length
        let c = arr[len - 1]
        let d = arr[0]
        return this.checkCrossWithLineSegments(c, d)
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 20:27:00 
     * @Desc: 判断某条线段是否会与当前存在的线段交叉 
     */
    checkCrossWithLineSegments(c, d, close) {
        // 已存在的线段
        let lineSegments = this.createLineSegments(close)
        let cross = false
        for (let i = 0; i < lineSegments.length; i++) {
            let item = lineSegments[i]
            let a = item[0]
            let b = item[1]
            if (utils.checkLineSegmentCross(a, b, c, d)) {
                cross = true
            }
        }
        return cross
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 20:24:28 
     * @Desc: 创建已存在点位组成的线段 
     */
    createLineSegments(close) {
        let arr = this.pointArr
        let len = arr.length
        // 已存在的线段
        let lineSegments = []
        for (let i = 0; i < len - 1; i++) {
            lineSegments.push([
                arr[i],
                arr[i + 1]
            ])
        }
        // 包含起点和终点组成的线段
        if (close) {
            lineSegments.push([
                arr[len - 1],
                arr[0]
            ])
        }
        return lineSegments
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 20:23:59 
     * @Desc: 三个端点以下不可能交叉 
     */
    checkCrossPrevCheck() {
        let len = this.pointArr.length
        // 三个端点以下不可能交叉
        if (len <= 2) {
            return false
        }
        return true
    }
}