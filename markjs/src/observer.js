export default class Observer {
    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-07-31 16:06:15
     * @Desc: 构造函数
     */
    constructor () {
        // 订阅的集合
        this.observerListeners = {};
        // 用于删除订阅
        this.observerToken = 0;
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-07-31 16:06:53
     * @Desc: 发布话题
     */
    publish (topic, ...arg) {
        if (!topic || !this.observerListeners[topic]) {
            return false;
        }
        let subList = this.observerListeners[topic];
        for (let i = 0; i < subList.length; i++) {
            if (subList[i].context) {
                subList[i].fn.apply(subList[i].context, arg);
            } else {
                subList[i].fn.apply(subList[i].fn, arg);
            }
        }
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-07-31 16:07:19
     * @Desc:  订阅某个话题
     */
    subscribe (topic, fn) {
        let context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (!this.observerListeners[topic]) {
            this.observerListeners[topic] = [];
        }
        this.observerToken++;
        this.observerListeners[topic].push({
            fn: fn,
            context: context,
            token: this.observerToken
        });
        return this.observerToken;
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-07-31 16:07:46
     * @Desc:  解除订阅
     */
    unsubscribe (token) {
        if (!token) {
            return false;
        }
        for (let k in this.observerListeners) {
            if (this.observerListeners.hasOwnProperty(k)) {
                for (let j = 0; j < this.observerListeners[k].length; j++) {
                    if (this.observerListeners[k][j].token === token) {
                        this.observerListeners[k].splice(j, 1);
                    }
                }
            }
        }
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-07-31 16:08:16
     * @Desc: 删掉某一类话题及其订阅
     */
    clearTopic (topic) {
        if (!topic) {
            return false;
        }
        for (let k in this.observerListeners) {
            if (this.observerListeners.hasOwnProperty(k)) {
                if (k === topic) {
                    delete this.observerListeners[k];
                }
            }
        }
    }

    /**
     * javascript comment
     * @Author: 王林25
     * @Date: 2020-07-31 16:08:35
     * @Desc: 删除所有话题及订阅
     */
    clearAll () {
        this.observerListeners = {};
        this.observerToken = 0;
    }
}
