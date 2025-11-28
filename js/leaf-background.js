window.addEventListener("load", function() {
    var c = document.createElement("canvas"),
        ctx = c.getContext("2d"),
        leaves = [],
        mouse = { x: null, y: null },
        w = window.innerWidth,
        h = window.innerHeight,
        rAF = window.requestAnimationFrame || function(f){ setTimeout(f, 1000/45) };

    c.id = "leaf-bg-canvas";
    c.style.cssText = "position:fixed;top:0;left:0;z-index:-1;pointer-events:none;opacity:0.45;width:100vw;height:100vh;";
    document.body.appendChild(c);

    function initLeaves() {
        leaves = [];
        var count = Math.min(50, Math.floor(w/30));
        for (var i = 0; i < count; i++) {
            leaves.push({
                x: Math.random()*w,
                y: Math.random()*h,
                size: Math.random()*15 + 10,
                speedX: Math.random() * 0.5 - 0.25,   // 水平轻微摆动
                speedY: Math.random() * 0.5 + 0.2,    // 垂直缓慢下落
                angle: Math.random()*360,
                spin: Math.random()*0.5 - 0.25,       // 缓慢旋转
                color: ["#c5d9c5","#9aba9a","#e3ebe3"][Math.floor(Math.random()*3)]
            });
        }
    }

    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        c.width = w;
        c.height = h;
        initLeaves();
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < leaves.length; i++) {
            var l = leaves[i];

            // 自然飘动
            l.x += l.speedX + Math.sin(l.y * 0.01) * 0.2;
            l.y += l.speedY;
            l.angle += l.spin;

            // 鼠标排斥
            if(mouse.x !== null){
                var dx = l.x - mouse.x,
                    dy = l.y - mouse.y,
                    dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 100){
                    var force = (100 - dist) / 100 * 1; // 减小排斥力度
                    l.x += dx / dist * force;
                    l.y += dy / dist * force;
                }
            }

            if(l.y > h + 20){
                l.y = -20;
                l.x = Math.random() * w;
            }

            ctx.save();
            ctx.translate(l.x, l.y);
            ctx.rotate(l.angle * Math.PI / 180);
            ctx.fillStyle = l.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, l.size/2, l.size, 0, 0, 2*Math.PI);
            ctx.fill();
            ctx.restore();
        }
        rAF(draw);
    }

    window.onmousemove = function(e){ mouse.x = e.clientX; mouse.y = e.clientY; };
    window.onmouseout = function(){ mouse.x = null; mouse.y = null; };
    window.onresize = resize;

    resize();
    initLeaves();
    draw();
});
