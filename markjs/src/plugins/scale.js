export default function EditPlugin(instance, utils) {
  let _resolve = null;
  let promise = new Promise((resolve) => {
    _resolve = resolve;
  });
  let scale = 1;
  let draging = false;
  let origX = 0;
  let origY = 0;
  let startX = 0;
  let startY = 0;
  let dragX = 0;
  let dragY = 0;
  let transition = "";
  let scaleStep = instance.opt.mobile ? 0.05 : 0.1;
  let maxScale = 10;

  // 重写toCanvasPos方法
  let originToCanvasPos = instance.toCanvasPos.bind(instance);
  instance.toCanvasPos = (e) => {
    let res = originToCanvasPos(e);
    return {
      x: res.x / scale,
      y: res.y / scale,
    };
  };

  // 鼠标滚动事件
  instance.el.addEventListener("wheel", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.deltaY > 0) {
      // 缩小
      zoomOut();
    } else {
      // 放大
      zoomIn();
    }
  });

  // 鼠标触摸事件
  let touchDistance = null;
  instance.on("MOUSEMOVE", (e, mobileEvent) => {
    if (!mobileEvent) {
      return;
    }
    if (mobileEvent.touches.length !== 2) {
      return;
    }
    let p1 = mobileEvent.touches[0];
    let p2 = mobileEvent.touches[1];
    let distance = utils.getTwoPointDistance(
      p1.clientX,
      p1.clientY,
      p2.clientX,
      p2.clientY
    );
    if (touchDistance === null) {
      touchDistance = distance;
      return;
    }
    if (distance > touchDistance) {
      // 放大
      zoomIn();
    } else {
      // 缩小
      zoomOut();
    }
    touchDistance = distance;
  });

  // 鼠标按下事件
  instance.on("MOUSEDOWN", (e) => {
    if (scale === 1) {
      return false;
    }
    origX = dragX;
    origY = dragY;
    startX = e.clientX;
    startY = e.clientY;
    draging = true;
    transition = "";
    setTransition();
  });

  // 鼠标移动事件
  instance.on("MOUSEMOVE", (e) => {
    if (
      instance.getState().curEditingMarkItem &&
      instance.getState().curEditingMarkItem.isDragging
    ) {
      return;
    }
    if (!draging) {
      return false;
    }
    let cx = e.clientX;
    let cy = e.clientY;
    let ox = cx - startX;
    let oy = cy - startY;
    dragX = origX + ox / scale;
    dragY = origY + oy / scale;
    setTransform();
  });

  // 鼠标松开事件
  instance.on("MOUSEUP", (e) => {
    draging = false;
    transition = "all 0.3s";
    setTransition();
    origX = 0;
    origY = 0;
  });

  // 设置变换
  const setTransform = () => {
    instance.el.style.transform = `scale(${scale}) translate(${dragX}px,${dragY}px)`;
  };

  // 设置过渡
  const setTransition = () => {
    instance.el.style.transition = transition;
  };

  // 放大
  const zoomIn = () => {
    if (scale < maxScale) {
      scale += scaleStep;
    } else {
      scale = maxScale;
    }
    setTransform();
  };

  // 缩小
  const zoomOut = () => {
    if (scale > 1) {
      scale -= scaleStep;
    } else {
      reset();
    }
    setTransform();
  };

  // 复位
  const reset = () => {
    scale = 1;
    draging = false;
    transition = "all 0.3s";
    setTransition();
    startX = 0;
    startY = 0;
    dragX = 0;
    dragY = 0;
    setTransform();
  };

  _resolve();
  return promise;
}
