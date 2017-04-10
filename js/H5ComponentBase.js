/*
* 基本图文组件对象 H5ComponentBase
* param {name} string 组件名称
* param cfg {object} 配置参数
* cfg.center {Boolean} 组件是否居中 true表示居中
* cfg.type {string} 组件类型 base bar pie radar ....
* cfg.width {number} 组件宽度 设计图多宽组件就设置多宽 里面做了相应的处理 /2
* cfg.height {number} 组件高度
* cfg.text {string} 组件文案
* cfg.bg {string} 组件背景URL地址
* cfg.css {object} 更多设置组件相关CSS样式
* cfg.onclick {function} 是否有相应函数
* */

var H5ComponentBase =function ( name, cfg ) {
    var cfg = cfg || {};
    var id = ( 'h5_c_'+Math.random() ).replace('.','_') ;

    // 把当前的组建类型添加到样式中进行标记
    var cls = ' h5_component_'+cfg.type; 
    var component = $('<div class="h5_component '+cls+' h5_component_name_'+name+'" id="'+id+'">');

    cfg.text   &&  component.text(cfg.text);
	cfg.html   &&  component.html(cfg.html);
    cfg.width  &&  component.width(cfg.width/2);
    cfg.height &&  component.height(cfg.height/2);

    cfg.css && component.css( cfg.css );
    cfg.bg  && component.css('backgroundImage','url('+cfg.bg+')');

    if( cfg.center === true){
        component.css({
            marginLeft : ( cfg.width/4 * -1) + 'px',
            left:'50%'
        })
    }
    //  是否添加了相应点击事件
    if( typeof cfg.onclick === 'function' ){
        component.on('click',cfg.onclick);
    }

    component.on('onLoad',function(){
        setTimeout(function(){
            component.addClass(cls+'_load').removeClass(cls+'_leave');
            cfg.animateIn && component.animate( cfg.animateIn );
        },cfg.delay || 0)

        return false;
    })
    component.on('onLeave',function(){

        setTimeout(function(){
            component.addClass(cls+'_leave').removeClass(cls+'_load');
            cfg.animateOut && component.animate( cfg.animateOut );
         },cfg.delay || 0)
        return false;
    })


    return component;
}