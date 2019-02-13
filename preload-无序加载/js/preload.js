// 图片预加载
// 使用闭包来模拟局部作用域,在里面定义的变量都是局部的。
(function($) {
    function Preload(imgs, options) {
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        // 将options 和 Preload.DEFAULTS 合并在一起生成新的对象
        this.opts = $.extend({}, Preload.DEFAULTS, options);

        // 执行无序加载的方法，方法加_下划线，标识是只是内部使用，不提供外部调用
        this._unoredered();
    };
    // 定义默认的参数
    Preload.DEFAULTS = {
        each: null, // 每一张图片加载完毕后执行
        all: null // 所有图片加载完毕后执行
    };

    Preload.prototype._unoredered = function () { // 无序加载
    	var imgs = this.imgs,
    		opts = this.opts,
    		count = 0,
    		len = this.imgs.length;

        // 遍历img数组中的所有路径
        $.each(imgs, function(i, src) {
        	// 严谨一点，判断src是不是字符串
        	if (typeof src !== 'string') return;

            // 创建Image对象， imgObj是有两个事件的，监听load和 error 事件
            var imgObj = new Image();

            // 当图片正常加载和加载出错都要处理，待加载完所有图片我们读取都是从缓存中读取，所以会非常的快。
            $(imgObj).on('load error', function() {
                opts.each && opts.each(count);

                // 当图片加载完时，处理一些事
                if (count >= len - 1) {
                    opts.all && opts.all();
                }
                // 每加载一张图片，count就加1
                count++;
            });
            // 最后将src赋值给图片对象imgObj的src
            imgObj.src = src;
        });
    };

    // jQuery提供了两种形式来完成插件: 
    // $.fn.extend 调用形式--> $('#img').preload() 和 $.extend 调用形式--> $.preload()
    $.extend({
    	preload: function(imgs, opts) {
    		new Preload(imgs, opts);
    	}
    });

})(jQuery);