(function($){
    $.fn.snow = function(options){
    var $flake = $('<div id="snowbox" />').css({'position': 'absolute', 'z-index': '-1', 'top': '-50px'}).html('&#10052;'),
    documentHeight     = $(document).height(),
    documentWidth    = $(document).width(),
    defaults = {
        minSize        : 10,
        maxSize        : 20,
        newOn        : 1000,
        flakeColor    : "#ffffff" /* 此处可以定义雪花颜色，若要白色可以改为#FFFFFF */
    },
    options    = $.extend({}, defaults, options);
    
    // 获取当前月份（0表示1月，1表示2月，以此类推）
    var currentMonth = new Date().getMonth();
    
    // 判断是否为冬季（12月、1月、2月）
    if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) {
        var interval = setInterval( function(){
            var startPositionLeft = Math.random() * documentWidth - 100,
            startOpacity = 0.5 + Math.random(),
            sizeFlake = options.minSize + Math.random() * options.maxSize,
            endPositionTop = documentHeight - 200,
            endPositionLeft = startPositionLeft - 500 + Math.random() * 500,
            durationFall = documentHeight * 10 + Math.random() * 5000;
            $flake.clone().appendTo('body').css({
                left: startPositionLeft,
                opacity: startOpacity,
                'font-size': sizeFlake,
                color: options.flakeColor
            }).animate({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.2
            },durationFall,'linear',function(){
                $(this).remove()
            });
        }, options.newOn);
    }
    };
})(jQuery);

$(function(){
    $.fn.snow({ 
        minSize: 5, /* 定义雪花最小尺寸 */
        maxSize: 50,/* 定义雪花最大尺寸 */
        newOn: 300  /* 定义密集程度，数字越小越密集 */
    });
});
