/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-21 20:27:55 
 * @Desc: 判断两条线段是否交叉 
 */
function checkLineSegmentCross(a, b, c, d) {
  let cross = false
  // 向量
  let ab = [b.x - a.x, b.y - a.y]
  let ac = [c.x - a.x, c.y - a.y]
  let ad = [d.x - a.x, d.y - a.y]
  // 向量叉乘，判断点c,d分别在线段ab两侧，条件1
  let abac = ab[0] * ac[1] - ab[1] * ac[0]
  let abad = ab[0] * ad[1] - ab[1] * ad[0]

  // 向量
  let dc = [c.x - d.x, c.y - d.y]
  let da = [a.x - d.x, a.y - d.y]
  let db = [b.x - d.x, b.y - d.y]
  // 向量叉乘，判断点a,b分别在线段dc两侧，条件2
  let dcda = dc[0] * da[1] - dc[1] * da[0]
  let dcdb = dc[0] * db[1] - dc[1] * db[0]

  // 同时满足条件1，条件2则线段交叉
  if (abac * abad < 0 && dcda * dcdb < 0) {
    cross = true
  }
  return cross
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-01-22 10:27:00 
 * @Desc: 求点到直线的距离 
 */
function getLinePointDistance(x1, y1, x2, y2, x, y) {
  // 直线垂直于x轴
  if (x1 === x2) {
    return Math.abs(x - x1)
  } else {
    let B = 1
    let A, C
    A = (y1 - y2) / (x2 - x1)
    C = 0 - B * y1 - A * x1
    return Math.abs((A * x + B * y + C) / Math.sqrt(A * A + B * B))
  }
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-01-22 17:28:15 
 * @Desc:  计算两点间连线的倾斜角
 */
function getAngle(x1, y1, x2, y2) {
  let a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
  return a > 0 ? a - 360 : a
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-01-22 14:25:25 
 * @Desc: 根据某条直线上的点x坐标获取y坐标 
 */
function getLinePointYByX(x1, y1, x2, y2, x) {
  // 直线垂直于x轴
  if (x1 === x2) {
    return Math.min(y1, y2)
  } else {
    let B = 1
    let A, C
    A = (y1 - y2) / (x2 - x1)
    C = 0 - B * y1 - A * x1

    const getY = (x) => {
      return (0 - C - A * x) / B
    }

    return getY(x)
  }
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-01-22 14:11:43 
 * @Desc: 获取某条直线上的所有点 
 */
function getLineAllPoint(x1, y1, x2, y2) {
  let arr = []
  // 直线垂直于x轴
  if (x1 === x2) {
    let dy = Math.abs(y2 - y1)
    let min = Math.min(y1, y2)
    for (let i = 0; i <= dy; i++) {
      arr.push([x1, min + i])
    }
  } else {
    let B = 1
    let A, C
    A = (y1 - y2) / (x2 - x1)
    C = 0 - B * y1 - A * x1

    const getY = (x) => {
      return (0 - C - A * x) / B
    }

    let dx = Math.abs(x2 - x1)
    let min = Math.min(x1, x2)
    for (let i = 0; i <= dx; i++) {
      arr.push([min + i, getY(min + i)])
    }
  }
  return arr
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-01-22 09:53:54 
 * @Desc: 两点距离公式 
 */
function getTwoPointDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-01-22 17:25:43 
 * @Desc: 获取一条线段上距离某个点最近的点 
 */
function getNearestPointFromLine(x1, y1, x2, y2, x, y) {
  let arr = getLineAllPoint(x1, y1, x2, y2)
  let min = Infinity
  let minPoint = null
  arr.forEach((item) => {
    let d = getTwoPointDistance(item[0], item[1], x, y)
    if (d < min) {
      min = d
      minPoint = item
    }
  })
  return minPoint
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-22 10:34:19 
 * @Desc: 加载图片 
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => {
      resolve(img)
    }
    img.onerror = e => {
      reject(e)
    }
    img.src = src
  })
}

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-15 13:42:44 
 * @Desc: 工具方法 
 */
export default {
  checkLineSegmentCross,
  loadImage,
  getTwoPointDistance,
  getLinePointYByX,
  getLineAllPoint,
  getLinePointDistance,
  getAngle,
  getNearestPointFromLine
}