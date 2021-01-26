import MarkItem from '../markItem'

/*
配置
{
    value: [
        {
            data: null,//附加数据
            pointArr: [{// 点位数据
                {"x":0,"y":0}
            }],
            strokeStyle: {},
            fillColor: '',
            pointStyle:{}
        }
    ],// 回显的标注区域数据
    fillColor: String, // 标注区域填充颜色
    strokeStyle: { // 标注轮廓样式
        lineWidth: 3, // 线条宽度
        strokeColor: 'rgba(0, 136, 255, 1)', // 线条颜色
        lineJoin: 'round' // 线条末端样式
    },
    pointStyle: {// 端点的样式
        lineWidth: 3,
        strokeColor: 'rgba(0, 136, 255, 1)',
        fillColor: 'rgba(0, 136, 255, 0.5)'
    },
    showPoint: true,// 是否绘制端点，默认true
    pointType: '',// 端点类型，square（正方形）、circle（圆形），默认square
    pointWidth: 4,// 端点的宽度，正方形的边长的一半、圆形的半径，默认3
    customRenderPoint(ctx, x, y, onlyPath, pointStyle) {// 自定义绘制端点方法
        // ctx（canvas绘图上下文）、x,y（中心点的位置）、onlyPath（为true代表用于检测点是否在该端点路径内时调用，此时不应该实际绘制出来，只要绘制路径即可）、pointStyle（端点样式）
    },
    max: 3,// 同时最多标注对象数量，默认-1，不限制
    hoverActive: false,// 鼠标滑过对象时显示可激活状态，默认false
    readonly: false,// 是否只读，默认false
    single: false,// 是否编辑某个区域时隐藏其他所有区域，默认false
    noCrossing: false,// 是否禁止某个标注对象自身线段交叉，和其他标注对象还是可以交叉的
    dbClickRemovePoint: false,// 是否允许双击顶点删除该顶点
    area: false,// 区域模式，从始至终都是一个闭合的图形
    adsorbent: true,// 是否开启吸附效果
    adsorbentNum: 5,// 吸附的距离，即距离小于等于该值时进行吸附
    adsorbentLine: true,// 是否允许吸附到线段上
    dbClickActive: false,// 是否双击激活标注对象，默认为单击激活
    singleClickComplete: true,// 默认情况下，双击结束编辑，如果该值设为true，除了新增创建期间外的编辑下如果单击了其他区域也可以结束编辑，设为false，即只允许双击结束编辑
    enableAddPoint: false,// 是否允许新增节点，仅在闭合情况下的编辑期间
}

属性

事件
CURRENT-MARK-ITEM-CHANGE（当前激活标注对象变化）
HOVER-ITEM（鼠标移到某个标注对象区域内）
COMPLETE-EDIT-ITEM（双击完成绘制）
IS-CREATE-MARKING-CHANGE（当前是否在创建中状态变化）

方法

插件开发
插件需要返回一个promise，resolve之后才会加载下一个插件，所以插件的use顺序十分重要
*/

// 默认配置
const defaultOpt = {
    value: [],
    max: -1,
    hoverActive: false,
    readonly: false,
    single: false,
    noCrossing: false,
    dbClickRemovePoint: false,
    area: false,
    adsorbent: true,
    adsorbentNum: 5,
    adsorbentLine: true,
    dbClickActive: false,
    singleClickComplete: true,
    enableAddPoint: false
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-15 10:25:23 
 * @Desc: 编辑插件
 */
export default function EditPlugin(instance, utils) {
    let _resolve = null
    let promise = new Promise((resolve) => {
        _resolve = resolve
    })
    let opt = {
        ...defaultOpt,
        ...instance.opt
    }
    // 修改鼠标插件的默认配置
    if (opt.dbClickActive) {
        if (instance.opt.cursorTips) {
            if (!instance.opt.cursorTips.HOVER) {
                instance.opt.cursorTips.HOVER = '双击激活该区域并进入编辑状态'
            }
        } else {
            instance.opt.cursorTips = {
                HOVER: '双击激活该区域并进入编辑状态'
            }
        }
    }
    // 全部的标注对象列表
    let markItemList = []
    // 当前编辑中的标注对象
    let curEditingMarkItem = null
    // 拖动整体时的起始位置
    let dragStartPos = {
        x: 0,
        y: 0
    }
    // 缓存一份拖动整体时的起始位置
    let dragStartPosCache = {
        x: 0,
        y: 0
    }
    // 编辑中
    let isReadonly = opt.readonly
    // 是否新增标注中，不包括闭合后的编辑
    let isCreateMarking = false
    // 创建新标注时的配置项
    let createMarkItemOpt = null
    // 缓存点位数据
    let cachePointArr = null
    // 标注对象递增id
    let mId = 0
    // 当前的吸附值，用来在修正点击事件要新增的顶点的坐标值
    let adsorbentedPos = null
    // 吸附整体时的偏移量
    let adsorbentedWholePos = [0, 0]
    // 用来控制整体吸附后的脱离
    let adsorbentedWholePosCacheMousePos = {x: 0, y: 0}
    // 刚才是否处于拖动中，用来修复click事件比mouseup事件慢的问题
    let lastIsDragging = false
    // 创建一个只用于渲染吸附时的顶点的标注对象
    let adsorbentMark = createNewMarkItem()

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 15:54:21 
     * @Desc: 回显数据 
     */
    function reShow() {
        if (opt.value.length > 0) {
            opt.value.forEach((item) => {
                let _markItem = new MarkItem(instance.ctx, {
                    id: mId++,
                    ...opt,
                    ...item,
                    pointArr: item.pointArr.map((point) => {
                        return {
                            x: point.x * instance.canvasEleRectInfo.width,
                            y: point.y * instance.canvasEleRectInfo.height
                        }
                    }),
                })
                _markItem.closePath()
                markItemList.push(_markItem)
            })
            render()
        }
    }
    reShow()

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 15:34:49 
     * @Desc: 获取所有变量的值 
     */
    function getState() {
        return {
            markItemList,
            curEditingMarkItem,
            isReadonly,
            isCreateMarking
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 16:46:38 
     * @Desc: 创建新标注对象实例 
     */
    function createNewMarkItem(plusOpt = {}) {
        return new MarkItem(instance.ctx, {
            id: mId++,
            ...opt,
            ...createMarkItemOpt,
            ...plusOpt,
            area: opt.area
        })
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-09-27 15:56:19 
     * @Desc: 绘制 
     */
    function render() {
        instance.clearCanvas()
        if (opt.single && (curEditingMarkItem || isCreateMarking)) {
            curEditingMarkItem && curEditingMarkItem.render()
        } else {
            markItemList.forEach((item) => {
                item.render()
            })
        }
        // 渲染吸附提示点
        if (adsorbentedPos) {
            adsorbentMark.drawPoint(adsorbentedPos[0], adsorbentedPos[1], false, true)
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 15:25:19 
     * @Desc: 清除对象的编辑状态
     */
    function disableAllItemsEdit() {
        markItemList.forEach((item) => {
            item.disable()
        })
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 19:14:36 
     * @Desc: 清除对象鼠标滑过显示可选择状态 
     */
    function disableAllItemsHoverActive() {
        markItemList.forEach((item) => {
            item.disableHoverActive()
        })
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 15:07:31 
     * @Desc: 检查包含某个点的标注对象 
     *  从后往前遍历是因为后面绘制的层级更高
     */
    function checkInPathItem(x, y) {
        for (let i = markItemList.length - 1; i >= 0; i--) {
            let item = markItemList[i]
            if (item.checkInPath(x, y) || item.checkInPoints(x, y) !== -1) {
                return item
            }
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-11-02 17:48:18 
     * @Desc: 找出所有包含该点的标注对象 
     */
    function checkInPathAllItems(x, y) {
        let items = []
        for (let i = markItemList.length - 1; i >= 0; i--) {
            let item = markItemList[i]
            if (item.checkInPath(x, y) || item.checkInPoints(x, y) !== -1) {
                items.push(item) 
            }
        }
        return items
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 20:00:59 
     * @Desc: 获取标注点位数据 
     */
    function getMarkData() {
        return markItemList.map((item) => {
            let pointArr = item.pointArr.map((point) => {
                return {
                    x: point.x / instance.canvasEleRectInfo.width,
                    y: point.y / instance.canvasEleRectInfo.height
                }
            })
            return {
                data: item.data,
                pointArr
            }
        })
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 11:29:16 
     * @Desc: 当前是否正在创建新标注中，即当前标注还未闭合 
     */
    function getIsCreateIngMarkItem () {
        return curEditingMarkItem && !curEditingMarkItem.isClosePath
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 09:41:24 
     * @Desc: 开启编辑模式 
     */
    function enableEdit () {
        isReadonly = false
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 14:58:24 
     * @Desc: 清除所有状态 
     */
    function reset() {
        disableAllItemsHoverActive()
        disableAllItemsEdit()
        setMarkEditItem(null)
        render()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 09:41:40 
     * @Desc: 开启只读模式，返回false代表当前有正在编辑中的对象，不能结束编辑
     */
    function disableEdit () {
        if (getIsCreateIngMarkItem()) {
            return false
        }
        reset()
        isReadonly = true
        return true
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 09:49:13 
     * @Desc: 设置当前创建状态
     */
    function setIsCreateMarking (state) {
        if (isReadonly) {
            return false
        }
        isCreateMarking = state
        instance.observer.publish('IS-CREATE-MARKING-CHANGE', state)
        return true
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 11:03:49 
     * @Desc: 创建新标注，返回false代表不能创建新标注
     * _opt：配置项，可添加MarkItem的所有配置项
     */
    function createMarkItem(_opt = null) {
        if (getIsCreateIngMarkItem() || isReadonly) {
            return false
        }
        reset()
        createMarkItemOpt = _opt
        setIsCreateMarking(true)
        if (opt.single) {
            instance.clearCanvas()
        }
        return true
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 18:58:23 
     * @Desc: 取消/退出创建
     * single为true的情况下编辑某个区域想要退出时可以调用reset方法
     */
    function exitCreate() {
        if (!isCreateMarking) {
            return false
        } 
        setIsCreateMarking(false)
        if (getIsCreateIngMarkItem()) {
            let index = markItemList.findIndex((item) => {
                return item === curEditingMarkItem
            })
            markItemList.splice(index, 1)
        }
        reset()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 09:49:13 
     * @Desc: 设置当前激活标注对象 
     */
    function setMarkEditItem (item) {
        if (isReadonly) {
            return false
        }
        curEditingMarkItem = item
        instance.observer.publish('CURRENT-MARK-ITEM-CHANGE', item)
        return true
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 10:31:25 
     * @Desc: 删除指定标注对象 
     */
    function deleteMarkItem (item) {
        if (!item) {
            return false
        }
        let index = markItemList.findIndex((i) => {
            return i === item
        })
        if (index !== -1) {
            if (curEditingMarkItem === item) {
                setMarkEditItem(null)
            }
            let deleteItem = markItemList.splice(index, 1)
            render()
            instance.observer.publish('DELETE-MARKING-ITEM', deleteItem[0], index)
            return true
        }
        return false
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 10:31:33 
     * @Desc: 删除所有标注对象 
     */
    function deleteAllMarkItem () {
        markItemList = []
        setMarkEditItem(null)
        render()
        instance.observer.publish('DELETE-ALL-MARKING-ITEM')
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2021-01-22 09:50:40 
     * @Desc: 吸附效果 
     */
    function checkAdsorbent(x, y) {
        if (!opt.adsorbent) {
            return [x, y]
        }
        let min = Infinity
        let _x = x, _y = y
        let _adsorbentedPos = null
        markItemList.forEach((item) => {
            // 端点
            item.pointArr.forEach((point, index) => {
                // 跳过自己和自己的比较
                if (curEditingMarkItem && item === curEditingMarkItem && item.dragPointIndex === index) {
                    return
                }
                let d = utils.getTwoPointDistance(point.x, point.y, x, y)
                if (d <= opt.adsorbentNum && d < min) {
                    min = d
                    _x = point.x
                    _y = point.y
                    _adsorbentedPos = [_x, _y]
                }
            })
            // 线段
            if (opt.adsorbentLine) {
                let nearestLine = item.getPintNearestLine(x, y)
                if (nearestLine && nearestLine[0] <= opt.adsorbentNum) {
                    let points = nearestLine[1]
                    let pointA = points[0]
                    let pointB = points[1]
                    let minx = Math.min(pointA.x, pointB.x)
                    let maxx = Math.max(pointA.x, pointB.x)
                    if (x >= minx && x <= maxx) {
                        let nearestPoint = utils.getNearestPointFromLine(pointA.x, pointA.y, pointB.x, pointB.y, x, y)
                        _x = nearestPoint[0]
                        _y = nearestPoint[1]
                        _adsorbentedPos = [_x, _y]
                    }
                }
            }
        })
        adsorbentedPos = _adsorbentedPos
        return [_x, _y]
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2021-01-23 11:11:01 
     * @Desc: 吸附整体 
     */
    function checkAdsorbentWhole(x, y) {
        if (!opt.adsorbent) {
            return [x, y]
        }
        let min = Infinity
        let minPoint = null
        let minPoint2 = null
        // 遍历当前图形和其他图形最近的两个顶点
        curEditingMarkItem.pointArr.forEach((pointItem) => {
            markItemList.forEach((markItem) => {
                if (markItem !== curEditingMarkItem) {
                    markItem.pointArr.forEach((markItemPointItem) =>{
                        let d = utils.getTwoPointDistance(pointItem.x, pointItem.y, markItemPointItem.x, markItemPointItem.y)
                        if (d < min) {
                            min = d
                            minPoint = pointItem
                            minPoint2 = markItemPointItem
                        }
                    })
                }
            })
        })
        if (min <= opt.adsorbentNum) {
            adsorbentedWholePos = [minPoint2.x - minPoint.x, minPoint2.y - minPoint.y]
            dragStartPos.x -= adsorbentedWholePos[0]
            dragStartPos.y -= adsorbentedWholePos[1]
        }
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:12:55 
     * @Desc: 监听单击事件 
     */
    instance.on('CLICK', (e) => {
        if (isReadonly) {
            return
        }
        if (lastIsDragging) {
            lastIsDragging = false
            return
        }
        let {
            x,
            y
        } = instance.toCanvasPos(e)
        // 检查点击的位置是否存在标注对象
        let inPathItem = null
         // 创建新对象
        if (isCreateMarking) {
            let _x = x
            let _y = y
            // 如果存在吸附数据则使用吸附数据
            if (adsorbentedPos) {
                _x = adsorbentedPos[0]
                _y = adsorbentedPos[1]
                adsorbentedPos = null
            }
            // 当前存在尚未闭合的激活对象
            if (curEditingMarkItem) {
                // 检查线段是否交叉
                if (opt.noCrossing) {
                    let cross = curEditingMarkItem.checkNextLineSegmentCross(_x, _y)
                    if (cross) {
                        instance.observer.publish('LINE-CROSS', curEditingMarkItem)
                    } else {
                        curEditingMarkItem.pushPoint(_x, _y)
                    }
                } else {
                    curEditingMarkItem.pushPoint(_x, _y)
                }
            } else {// 当前没有这种标注中的对象
                // 数量判断
                if (opt.max === -1 || markItemList.length < opt.max) {
                    disableAllItemsEdit()
                    setMarkEditItem(createNewMarkItem())
                    curEditingMarkItem.enable()
                    curEditingMarkItem.pushPoint(_x, _y)
                    markItemList.push(curEditingMarkItem)
                } else { // 超出数量限制
                    instance.observer.publish('COUNT-LIMIT', curEditingMarkItem)
                    setIsCreateMarking(false)
                }
            }
        } else if (inPathItem = checkInPathItem(x, y)) { // 当前点击的位置存在标注对象
            // !(opt.single && curEditingMarkItem) && 
            if (!opt.dbClickActive && !checkInPathAllItems(x, y).includes(curEditingMarkItem)) {
                if (!opt.single || (opt.single && !curEditingMarkItem)) {
                    disableAllItemsEdit()
                    inPathItem.enable()
                    setMarkEditItem(inPathItem)
                }
            }
        } else {// 点击空白处清除当前所有状态
            if (!opt.single && opt.singleClickComplete) {
                reset()
            }
        }
        render()
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 14:14:57 
     * @Desc: 监听双击事件 
     */
    instance.on('DOUBLE-CLICK', (e) => {
        if (isReadonly) {
            return
        }
        let {
            x,
            y
        } = instance.toCanvasPos(e)
        // 能否激活其他对象
        let canActive = true
        // 检查当前双击的位置最上层的编辑对象
        let inPathItem = checkInPathItem(x, y)
        // 检查当前双击的对象是否和当前编辑中的对象是同一个
        let isSame = inPathItem && curEditingMarkItem ? inPathItem === curEditingMarkItem : false
        // 当前存在编辑中的对象
        if (curEditingMarkItem) {
            // 点击的是顶点
            let inPointIndex = curEditingMarkItem.checkInPoints(x, y)
            if (opt.dbClickRemovePoint && inPointIndex !== -1) {
                canActive = false
                if (curEditingMarkItem.getPointLength() > 3) {
                    curEditingMarkItem.removePoint(inPointIndex)
                    render()
                } else {
                    instance.observer.publish('NOT-ENOUGH-POINTS-REMOVE', curEditingMarkItem)
                }
            } else {
                // 端点数量不足三个
                if (curEditingMarkItem.getPointLength() < 3) {
                    canActive = false
                    instance.observer.publish('NOT-ENOUGH-END-POINTS', curEditingMarkItem)
                } else if (opt.noCrossing && curEditingMarkItem.checkEndLineSegmentCross()) {// 线段存在交叉
                    canActive = false
                    instance.observer.publish('LINE-CROSS', curEditingMarkItem)
                } else {
                    if (isCreateMarking) {
                        instance.observer.publish('COMPLETE-CREATE-ITEM', curEditingMarkItem, e)
                    }
                    setIsCreateMarking(false)
                    curEditingMarkItem.closePath()
                    curEditingMarkItem.disable()
                    adsorbentedPos = null
                    setMarkEditItem(null)
                    render()
                    instance.observer.publish('COMPLETE-EDIT-ITEM', curEditingMarkItem, e)
                }
            }
        }
        // 双击激活标注对象
        if (opt.dbClickActive && !isCreateMarking && canActive && inPathItem && !isSame) {
            disableAllItemsEdit()
            inPathItem.enable()
            setMarkEditItem(inPathItem)
            render()
        }
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 15:43:14 
     * @Desc: 监听鼠标按下事件 
     */
    instance.on('MOUSEDOWN', (e) => {
        if (isReadonly) {
            return
        }
        let {
            x,
            y
        } = instance.toCanvasPos(e)
        if (!curEditingMarkItem || !curEditingMarkItem.isEditing || !curEditingMarkItem.isClosePath) {
            return
        }
        // 判断是否在端点内
        let inPointIndex = curEditingMarkItem.checkInPoints(x, y)
        // 是否在路径内
        let isInPath = curEditingMarkItem.checkInPath(x, y)
        if (isInPath || inPointIndex !== -1) {
            if (opt.noCrossing) {
                cachePointArr = JSON.parse(JSON.stringify(curEditingMarkItem.pointArr))
            }
            dragStartPos.x = x
            dragStartPos.y = y
            dragStartPosCache.x = x
            dragStartPosCache.y = y
            curEditingMarkItem.enableDrag(inPointIndex)
        }
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 16:57:32 
     * @Desc: 监听鼠标移动事件 
     */
    instance.on('MOUSEMOVE', (e) => {
        if (isReadonly) {
            return
        }
        let {
            x,
            y
        } = instance.toCanvasPos(e)
        // 拖动编辑
        if (curEditingMarkItem && curEditingMarkItem.isDragging) {
            if (curEditingMarkItem.dragPointIndex !== -1) {// 拖动单个顶点
                curEditingMarkItem.dragPoint(...checkAdsorbent(x, y))
            } else {// 拖动整体图形
                checkAdsorbentWhole()
                // 控制吸附后的脱离
                if (adsorbentedWholePos[0] !== 0 && adsorbentedWholePos[1] !== 0 && adsorbentedWholePosCacheMousePos.x === 0 && adsorbentedWholePosCacheMousePos.y === 0) {
                    adsorbentedWholePosCacheMousePos.x = x
                    adsorbentedWholePosCacheMousePos.y = y
                }
                if (adsorbentedWholePosCacheMousePos.x !== 0 && adsorbentedWholePosCacheMousePos.y !== 0) {
                    if (utils.getTwoPointDistance(adsorbentedWholePosCacheMousePos.x, adsorbentedWholePosCacheMousePos.y, x, y) > opt.adsorbentNum) {
                        adsorbentedWholePos = [0, 0]
                        dragStartPos.x = dragStartPosCache.x
                        dragStartPos.y = dragStartPosCache.y
                        adsorbentedWholePosCacheMousePos.x = 0
                        adsorbentedWholePosCacheMousePos.y = 0
                    }
                }
                let ox = x - dragStartPos.x
                let oy = y - dragStartPos.y
                curEditingMarkItem.dragAll(ox, oy)
            }
            render()
            let inPointIndex = curEditingMarkItem.checkInPoints(x, y)
            instance.observer.publish('HOVER-ITEM', curEditingMarkItem, curEditingMarkItem, checkInPathAllItems(x, y), e, inPointIndex)
        } else if(isCreateMarking) {// 创建新标注中
            let ox = x - dragStartPos.x
            let oy = y - dragStartPos.y
            let apos = checkAdsorbent(ox, oy)
            // 始终闭合模式
            if (opt.area && curEditingMarkItem) {
                curEditingMarkItem.areaToPoint(...apos)
            }
            render()
        } else if(!isCreateMarking){// 显示可选择状态
            let inPathItem = checkInPathItem(x, y)
            // 鼠标滑过显示可选择状态
            if (opt.hoverActive && (!curEditingMarkItem || curEditingMarkItem.isClosePath)) {
                disableAllItemsHoverActive()
                inPathItem && inPathItem.enableHoverActive()
                render()
            }
            if (inPathItem && inPathItem.isClosePath) {
                let inPointIndex = inPathItem.checkInPoints(x, y)
                instance.observer.publish('HOVER-ITEM', inPathItem, curEditingMarkItem, checkInPathAllItems(x, y), e, inPointIndex)
            }
        }
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-15 18:31:56 
     * @Desc: 监听鼠标松开事件 
     */
    instance.on('MOUSEUP', (e) => {
        if (isReadonly) {
            return
        }
        if (curEditingMarkItem && curEditingMarkItem.isDragging) {
            lastIsDragging = true
            curEditingMarkItem.disableDrag()
            dragStartPos.x = 0
            dragStartPos.y = 0
            dragStartPosCache.x = 0
            dragStartPosCache.y = 0
            if (opt.noCrossing && curEditingMarkItem.checkLineSegmentCross()) {
                instance.observer.publish('LINE-CROSS', curEditingMarkItem)
                curEditingMarkItem.pointArr = cachePointArr
                cachePointArr = null
            }
            render()
        }
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 09:42:10 
     * @Desc: 暴露方法给实例引用 
     */
    instance._disableAllItemsEdit = disableAllItemsEdit
    instance._setMarkEditItem = setMarkEditItem
    instance._createNewMarkItem = createNewMarkItem
    instance._setIsCreateMarking = setIsCreateMarking
    instance._render = render
    instance._disableAllItemsHoverActive = disableAllItemsHoverActive
    instance._checkInPathItem = checkInPathItem
    instance._checkInPathAllItems = checkInPathAllItems
    instance._getIsCreateIngMarkItem = getIsCreateIngMarkItem

    instance.getState = getState
    instance.getMarkData = getMarkData
    instance.enableEdit = enableEdit
    instance.disableEdit = disableEdit
    instance.deleteMarkItem = deleteMarkItem
    instance.deleteAllMarkItem = deleteAllMarkItem
    instance.createMarkItem = createMarkItem
    instance.exitCreate = exitCreate
    instance.reset = reset

    _resolve()
    return promise
}