/*折线图组件*/
var H5ComponentPolyline = function (name,cfg) {
    var component = new H5ComponentBase(name,cfg)
    /*Canvas绘制网格线*/
    var w = cfg.width;
    var h = cfg.height;

    // 加入一个画布 (绘制网格线）
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = cns.height = h;
    component.append(cns);

    // 水平网格线 100份 -> 10份
    var step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e0e0e0";
    window.ctx = ctx;
    for(var i=0;i<step+1;i++){
        var y = (h/step) * i;
        ctx.moveTo(0,y);
        ctx.lineTo(w,y);
    }

    // 垂直网格线 (根据项目的个数去分)
    // 因为画网格线 数据的值是交在网格线上  所以要多画一条
    step = cfg.data.length+1;
    var text_w = w/step>>0;
    for(var i=0;i<step+1;i++){
        var x = (w/step)*i;
        ctx.moveTo(x,0);
        ctx.lineTo(x,h);

        // 项目文本
        if(cfg.data[i]){
            var text = $('<div class="text"></div>');
            text.text(cfg.data[i][0]);
            text.css('width',text_w).css("left",(x/2-text_w/4) + (text_w/2));
            component.append(text);
        }

    }
    ctx.stroke();

    // 加入画布 -> 数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = cns.height = h;
    component.append(cns);

    /*
    * 绘制折线数据 以及对应的阴影
    * per {float} 0-1之间的数据,会根据这个值绘制最终数据对应的中间状态
    * */
    var draw = function (per) {
        //清空画布
        ctx.clearRect(0,0,w,h);
   // 绘制折线数据 因为不在一个层级上 折线是变动的
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff8878";

        var x = 0;
        var y = 0;
        //ctx.moveTo(10,10);
        //ctx.arc(10,10,5,0,2*Math.PI);

        var row_w = (w / (cfg.data.length+1));
        // 画点
        for(i in cfg.data){
            var item = cfg.data[i];
            x = row_w * i + row_w;
            y = h-(item[1]*h*per);
            ctx.moveTo(x,y);
            ctx.arc(x,y,5,0,2*Math.PI);
        }
        // 连线
        // 移动画笔到第一个数据的点位置
        ctx.moveTo(row_w,h-(cfg.data[0][1]*h*per));
        for(i in cfg.data){
            var item = cfg.data[i];
            x = row_w * i + row_w;
            y = h-(item[1]*h*per);
            ctx.lineTo(x,y);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,136,120,0)";

        // 阴影
        ctx.lineTo(x,h);
        ctx.lineTo(row_w,h);
        ctx.fillStyle = 'rgba(255,136,120,.37)';
        ctx.fill();

        // 写数据
        for(i in cfg.data){
            var item = cfg.data[i];
            x = row_w * i + row_w;
            y = h-(item[1]*h*per);
            ctx.moveTo(x,y);
            ctx.fillStyle = item[2] ? item[2]:'#595959';
           ctx.fillText(((item[1]*100)>>0)+'% ',x-10,y-10);
        }
         ctx.stroke();
   };

        //折线图生长动画
        component.on('onLoad',function () {
            var s = 0;
            for(var i=0;i<100;i++){
                setTimeout(function () {
                    s+=.01;
                    draw(s);
                },i*10+500)
            }
           /*
           *  i*10
           *  第一次 i = 0；
           *  第二次 i = 10
           *  第二次 i = 20
           * */
        });

        //折线图退场动画
        component.on('onLeave',function () {
            var s = 1;
            for(var i=0;i<100;i++){
                setTimeout(function () {
                    s -= .01;
                    draw(s);
                },i*10)
            }

        });
        return component;
}