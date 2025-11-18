function setImageSize(image, width, height) {
    if (width) image.setAttribute("width", width + "px");
    if (height) image.setAttribute("height", height + "px");
  }
  
  function setImageAlign(image, align) {
    if (!align) return;
    align = align.toLowerCase();
    if (align === 'l') {
      image.style.display = 'block';
      image.style.marginLeft = '0';
      image.style.marginRight = 'auto';
    } else if (align === 'r') {
      image.style.display = 'block';
      image.style.marginLeft = 'auto';
      image.style.marginRight = '0';
    }
    // 中间或其他不处理
  }
  
  function hexoResizeImage() {
    const imgs = document.querySelectorAll('img');
  
    imgs.forEach(img => {
      const src = img.getAttribute('src');
      if (!src) return; // 避免报错
  
      // 匹配 ?100x200l 或 ?50r 或 ?100x200 等
      const match = src.match(/\?(\d*)x?(\d*)([lr]?)/i);
      if (!match) return;
  
      let width = match[1] ? parseFloat(match[1]) : 0;
      let height = match[2] ? parseFloat(match[2]) : 0;
      const align = match[3] || null;
  
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
  
      // 宽高比例计算
      if (width && !height) {
        height = Math.round(naturalHeight * width / naturalWidth);
      } else if (height && !width) {
        width = Math.round(naturalWidth * height / naturalHeight);
      } else if (!width && !height && match[1]) {
        // 纯百分比缩放 ?50
        const scale = parseFloat(match[1]) / 100;
        width = Math.round(naturalWidth * scale);
        height = Math.round(naturalHeight * scale);
      }
  
      setImageSize(img, width, height);
      setImageAlign(img, align);
    });
  }
  
  window.addEventListener('load', hexoResizeImage);
  