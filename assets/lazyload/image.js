'use strict';
module.exports = function(config) {
  let { ratio, canWebp, mode, picArea } = config;
  mode = mode || 1;
  ratio = ratio || 1;
  picArea = picArea || 'window';
  let formatStr = '';
  let loadCount = 0;
  if(canWebp) {
    formatStr = '/format/webp';
  }
  function getNodeHeight(node) {
    return node.innerHeight ? node.innerHeight(): node.height();
  }
  function loadImg(imgNode) {
    let src = imgNode.data('img');
    let imgObj = new Image();
    if( picArea === 'box'){
      let imgPath = `${src}?imageView2/${mode}/w/150`;
      imgObj.src = imgPath;
      imgObj.onload = () => {
        imgNode.attr('src', imgPath);
      };
    }else{
      let w = imgNode.width();
      let h = getNodeHeight(imgNode);
      let wNum = Math.floor(w * ratio);
      let hNum = Math.floor(h * ratio);
      let imgPath = `${src}?imageView2/${mode}/w/${wNum}/h/${hNum}${formatStr}`;
      imgObj.onload = () => {
        imgNode.css({
          backgroundImage: `url('${imgPath}')`,
          backgroundSize: `cover`,
          backgroundPosition: `0px 0px`,
        });
      };
      imgObj.src = imgPath;
    }

  }
  let imgArr = [];
  return {
    addImages: function(imgs) {
      imgArr = imgArr.concat(imgs);
    },
    clearImages: function() {
      imgArr = [];
    },
    check: function(scrollTop, viewHeight) {
      imgArr.forEach(imgNode => {
        // offset返回的是相对于文档的偏移
        let { top } = imgNode.offset();
        let height = getNodeHeight(imgNode);
        // 图片距离页面顶端高度 > 窗口距离顶端高度时（不在上面）且 < （窗口距离顶端高度 + 窗口高度）（不在下面）
        let topInView = top > scrollTop && top < scrollTop + viewHeight;
        let bottomInView = top + height > scrollTop && top + height < scrollTop + viewHeight;
        let inView = topInView || bottomInView;
        if(!imgNode._loading && inView) {
          imgNode._loading = true;
          loadCount++;
          loadImg(imgNode);
        }
      });
      if(loadCount === imgArr.length){
        return true;
      }
    },
    loadImg: loadImg
  };
};
