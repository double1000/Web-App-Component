var H5_loading = function (images,firstPage) {
    // 取得页面的id
    var id = this.id;

    if(this._images === undefined){
        // 第一次进入
        this._images = (images || []).length;
        // 表示加载资源的数量 第一次 就是0个
        this._loaded = 0;
        //把当前对象存储在全局对象 window 中，用来
        // 进行某个图片加载完成之后的回调
        window[id] = this;
        for(s in images){
            var item = images[s];
            var img = new Image;
            img.onload = function () {
                window[id].loader();
            }
            img.src = item;
        }
        $('#rate').text('0%');
        return this;
    }else{
        // 第二次进入走这里
        this._loaded ++;
        // >> 0 快速干掉小数
        $('#rate').text(((this._loaded / this._images * 100)>>0) + '%');

        if(this._loaded < this._images){
            // 这儿不能置空 还没有加载完
            //window[id].loader = null;
            // 当它小于他的时候就不往下走 等于它的情况下 说明加载完成
            return this;
        }
    }

    // 这儿置空 加载完成
    window[id].loader = null;

    this.el.fullpage({
        onLeave : function (index,nextIndex,direction) {
            $(this).find('.h5_component').trigger('onLeave');
        },
        afterLoad:function (anchoLink,index) {
            $(this).find('.h5_component').trigger('onLoad');
        }
    });
    this.page[0].find('.h5_component').trigger('onLoad');
    this.el.show();
    if(firstPage){
        $.fn.fullpage.moveTo( firstPage );
    }
}