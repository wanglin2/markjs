const defaultOpt = {
    shape: {
        // 正方形
        square: {
            create({width, height}) {
                let _width
                if (width > height) {
                    _width = height * 0.5
                } else {
                    _width = width * 0.5
                }
                let hw = (width - _width) / 2
                let hh = (height - _width) / 2
                return [
                    {
                        x: hw,
                        y: hh
                    },
                    {
                        x: hw + _width,
                        y: hh
                    },
                    {
                        x: hw + _width,
                        y: hh + _width
                    },
                    {
                        x: hw,
                        y: hh + _width
                    }
                ]
            },
            update(instance, x, y) {
                let fixIndex = (instance.dragPointIndex + 2) % 4
                let fixPoint = instance.pointArr[fixIndex]
                let width = Math.max(Math.abs(x - fixPoint.x), Math.abs(y - fixPoint.y))
                let newX = (x > fixPoint.x ? fixPoint.x + width : fixPoint.x - width)
                let newY = (y > fixPoint.y ? fixPoint.y + width : fixPoint.y - width)
                let even = instance.dragPointIndex % 2 === 0
                instance.pointArr[fixIndex] = {
                    x: fixPoint.x,
                    y: fixPoint.y
                }
                instance.pointArr[instance.dragPointIndex] = {
                    x: newX,
                    y: newY
                }
                instance.pointArr[(instance.dragPointIndex + 1) % 4] = {
                    x: even ? newX : fixPoint.x,
                    y: even ? fixPoint.y : newY
                }
                instance.pointArr[(instance.dragPointIndex + 3) % 4] = {
                    x: even ? fixPoint.x : newX,
                    y: even ? newY : fixPoint.y
                }
            }
        }
    },
    max: -1
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-22 15:51:08 
 * @Desc: 形状插件 
 * 回显的数据里需要添加shape属性，否则不会保持特定形状
 */
export default function ShapePlugin(instance) {
    let _resolve = null
    let promise = new Promise((resolve) => {
        _resolve = resolve
    })
    let opt = {
        ...defaultOpt,
        ...instance.opt,
        shape: {
            ...defaultOpt.shape,
            ...instance.opt.shape
        }
    }
    let {
        markItemList
    } = instance.getState()
    let {
        _disableAllItemsEdit: disableAllItemsEdit,
        _setMarkEditItem: setMarkEditItem,
        _createNewMarkItem: createNewMarkItem,
        _setIsCreateMarking: setIsCreateMarking,
        _render: render
    } = instance

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-23 14:23:34 
     * @Desc: 遍历标注是否存在特定形状，有的话添加更新方法 
     */
    function addUpdate() {
        markItemList.forEach((item) => {
            if (item.opt.shape && opt.shape[item.opt.shape]) {
                item.updatePointFn = opt.shape[item.opt.shape].update
            }
        })
    }
    addUpdate()

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 16:37:36 
     * @Desc: 创建指定形状 
     */
    function createShapeMarkItem(shape, _opt = {}) {
        let _shape = opt.shape[shape]
        if (!_shape) {
            return
        }
        // 数量判断
        if (opt.max === -1 || markItemList.length < opt.max) {
            disableAllItemsEdit()
            setMarkEditItem(createNewMarkItem({
                pointArr: _shape.create(instance.canvasEleRectInfo),
                updatePoint: _shape.update,
                ..._opt
            }))
            instance.getState().curEditingMarkItem.closePath()
            instance.getState().curEditingMarkItem.enable()
            markItemList.push(instance.getState().curEditingMarkItem)
        } else { // 超出数量限制
            instance.observer.publish('COUNT-LIMIT', curEditingMarkItem)
            setIsCreateMarking(false)
        }
        render()
    }

    instance.createShapeMarkItem = createShapeMarkItem

    _resolve()
    return promise
}