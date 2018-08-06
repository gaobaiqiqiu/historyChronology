/*最大的div的宽高*/
// var docuWidth = document.documentElement.clientWidth;  //可见区域宽度
// var docuHeight = document.documentElement.clientHeight; //可见区域高度
// $('#dv').css('height',docuHeight + 'px');
// $('#dv').css('width',docuWidth + 'px');


$('.progress .img3').on('touchmove',function (e) {
    $(this).addClass("heartAnimation");
    var moveImg3 = e.touches[0].clientX;
    var img2Left = $('.progress .img2')[0].offsetLeft;
    var img2Width = $('.progress .img2')[0].offsetWidth;
    var moveImg1 = moveImg3 - img2Left + 10;
    // console.log(moveImg1)
    var img1Width = img2Width - moveImg1;
    if(moveImg3 < img2Left/1.3){
        moveImg3 = img2Left/1.3
    }
    if(moveImg3 > img2Width + img2Left/1.2){
        moveImg3 = img2Width + img2Left/1.2
    }
    if(img1Width > img2Width){
        img1Width = img2Width
    }
    $('.progress .img3').css('left',moveImg3 + 'px');
    $('.progress .img1').css('width',img1Width + 'px');
});

