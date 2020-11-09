/*
配置
{
    cursorTips: {// 提示信息
        START: '单击进行绘制，双击结束操作',
        EDITING: '拖曳移动节点或区域，双击结束操作',
        HOVER: '单击激活该区域并进入编辑状态',
        EDITING_POINT: '拖拽移动节点，修改区域边界，双击删除节点'
    },
    showPen: true,// 是否显示笔
    penImg: ''// 鼠标指针图片
}

属性

事件

方法
*/

// 默认配置
const defaultOpt = {
    showPen: true,
    penImg: require('../assets/pen.png'),
    cursorTips: {
        START: '单击进行绘制，双击结束操作',
        EDITING: '拖曳移动节点或区域，双击结束操作',
        HOVER: '单击激活该区域并进入编辑状态',
        EDITING_POINT: '拖拽移动节点，修改区域边界，双击删除节点'
    }
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-16 11:16:20 
 * @Desc: 鼠标样式插件 
 */
export default function mousePlugin(instance){
    let _resolve = null
    let promise = new Promise((resolve) => {
        _resolve = resolve
    })
    let opt = {
        ...defaultOpt,
        ...instance.opt
    }
    let canvasEle = instance.canvasEle
    let cursorTipEle = null
    let tips = {
        ...defaultOpt.cursorTips,
        ...opt.cursorTips
    }
    let isHoverInItem = false

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:37:52 
     * @Desc: 创建元素 
     */
    function createEle() {
        cursorTipEle = document.createElement('div')
        cursorTipEle.style.cssText = `
            position: fixed;
            height: 20px;
            background-color: #fff;
            color: #000;
            line-height: 20px;
            font-size: 12px;
            padding: 0 10px;
            user-select: none;
            display: none;
            z-index: 3;
        `
        document.body.appendChild(cursorTipEle)
    }
    createEle()

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:40:59 
     * @Desc: 显示元素 
     */
    function showEle() {
        cursorTipEle.style.display = 'block'
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:41:11 
     * @Desc: 隐藏元素 
     */
    function hideEle() {
        cursorTipEle.style.display = 'none'
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:59:59 
     * @Desc: 显示画笔 
     */
    function showPen() {
        if (!opt.showPen) {
            return
        }
        canvasEle.style.cursor = `url('${opt.penImg}') ,default`
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 14:01:26 
     * @Desc: 隐藏画笔 
     */
    function hidePen() {
        canvasEle.style.cursor = 'default'
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:38:39 
     * @Desc: 设置元素位置 
     */
    function setElePos(left, top) {
        cursorTipEle.style.left = left + 'px'
        cursorTipEle.style.top = top + 'px'
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:40:26 
     * @Desc: 设置元素内容 
     */
    function setEleText(text = '') {
        cursorTipEle.innerHTML = text
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 14:04:35 
     * @Desc: 隐藏全部 
     */
    function hideAll () {
        hidePen()
        hideEle()
        setElePos(0, 0)
        setEleText()
    }

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 11:27:29 
     * @Desc: 鼠标移入事件 
     */
    instance.on('MOUSEMOVE', (e) => {
        if (isHoverInItem) {
            hidePen()
        } else {
            hideAll()
            if (instance.getState().isCreateMarking) {
                showPen()
                setElePos(e.clientX + 30, e.clientY)
                setEleText(tips.START)
                showEle()
            }
        }
        isHoverInItem = false
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:44:47 
     * @Desc: 鼠标移出事件 
     */
    instance.on('MOUSELEAVE', (e) => {
        hideAll()
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 13:50:30 
     * @Desc: 鼠标移到某个区域内 
     */
    instance.on('HOVER-ITEM', (item, curItem, allInItems, e, inPointIndex) => {
        if (!curItem || curItem.isClosePath) {
            isHoverInItem = true
            setElePos(e.clientX + 30, e.clientY)
            if (instance.opt.single) {
                if (curItem && allInItems.includes(curItem)) {
                    if (opt.dbClickRemovePoint && inPointIndex !== -1) {
                        setEleText(tips.EDITING_POINT)
                    } else {
                        setEleText(tips.EDITING)
                    }
                    showEle()
                } else {
                    if (!curItem) {
                        setEleText(tips.HOVER)
                        showEle()
                    } else {
                        setEleText()
                        hideEle()
                    }
                }
            } else {
                if (curItem && allInItems.includes(curItem)) {
                    if (opt.dbClickRemovePoint && inPointIndex !== -1) {
                        setEleText(tips.EDITING_POINT)
                    } else {
                        setEleText(tips.EDITING)
                    }
                    showEle()
                } else {
                    if (item.isEditing) {
                        setEleText(tips.EDITING)
                        showEle()
                    } else {
                        setEleText(tips.HOVER)
                        showEle()
                    }
                }
            }
        }
    })

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-16 14:04:05 
     * @Desc: 完成某个区域绘制 
     */
    instance.on('COMPLETE-EDIT-ITEM', () => {
        hideAll()
    })

    _resolve()
    return promise
}