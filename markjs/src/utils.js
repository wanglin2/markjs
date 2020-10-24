/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2020-10-15 13:42:44 
 * @Desc: 工具方法 
 */
export default {
    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-21 20:27:55 
     * @Desc: 判断两条线段是否交叉 
     */
    checkLineSegmentCross(a, b, c, d) {
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
    },

    /** 
     * javascript comment 
     * @Author: 王林25 
     * @Date: 2020-10-22 10:34:19 
     * @Desc: 加载图片 
     */
    loadImage (src) {
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
}