/*3秒后将上下提示箭头隐藏*/
setTimeout(function(){
    $('.icon').css('display','none')
},3000);

//js获取url参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var dynastyId = GetQueryString("dynastyId");

var dynastyList;  //朝代列表
var mySwiper;  //左右滑动
var shouSwiperIndex = 0;  //朝代的索引
var SwiperList = {};  //将所有的朝代按朝代ID值存储到一个对象中
var sonIndex = 0;  //左右滑动时准确的拿到所滑到的朝代当先显示的内容的索引
var playAudio = null;  //正在播放的音频
var playEtext = null;  //正在播放的音频所对应的内容
var swiperAllIn = []; //所有的朝代内容
var swiperAll = [];  //所有的朝代内容分别对应的歌词
var samllIndex = 0;  //上下滑动时朝代中内容的索引
var _processK; //调用卡拉ok效果

$(function(){
    $.ajax({
        type:"post",
        url:"http://www.dadpat.com/dynasty/getAllList.do",
        dataType:"jsonp", //以键/值对的形式
        async:true,
        success:function(data){
            console.log(data.data);
            dynastyList = data.data;
            var chaodaiList = {};
            for( var i = 0; i < dynastyList.length; ++i ){
                var swiper1ID = "swiper1" + dynastyList[i]["dynastyId"];
                var swiper2ID = "swiper2" + dynastyList[i]["dynastyId"];
                var chaoDaiName = '';
                /*朝代名字*/
                if(dynastyList[i]["dynastyName"].length>1){
                    chaoDaiName = dynastyList[i]["dynastyName"];
                }else{
                    chaoDaiName=dynastyList[i]["dynastyName"]+"朝"
                }
                if( dynastyId == dynastyList[i]["dynastyId"] ){
                    shouSwiperIndex = i;
                }
                /*添加朝代名字、分别保存图片和内容的swiper的ID*/
                chaodaiList[dynastyList[i]["dynastyId"]] = $($("#template").html().replace("$chaodai$", chaoDaiName).replace("$id1$", swiper1ID ).replace("$id2$", swiper2ID));
                $(".swiper1").append( chaodaiList[dynastyList[i]["dynastyId"]] );
                //获取session中的值
                var initIndex = sessionStorage.getItem( dynastyId );
                $.ajax({
                    type: "post",
                    url: "http://www.dadpat.com/dynastyInfo/getAllList.do",
                    dataType: "jsonp", //以键/值对的形式
                    async: true,
                    data:{"dynastyId": dynastyList[i]["dynastyId"] },
                    success: function (data) {
                        var chaodaiData = data.data;  //拿到各个朝代的data
                        //console.log(chaodaiData);
                        var dynastyId = chaodaiData[0]["dynastyId"]; //拿到各个朝代的ID
                        var chaoDaiIndex = -1;
                        for( var n = 0; n < dynastyList.length; ++n ){
                            if( dynastyId == dynastyList[n]["dynastyId"] ){
                                chaoDaiIndex = n;
                                break;
                            }
                        }
                        if( chaoDaiIndex < 0 ){
                            return;
                        }
                        swiperAllIn.push(chaodaiData[0]["dynastyDescp"].split(";")[0]);
                        swiperAll.push(chaodaiData[0]["dynastyDescp"].split(";")[1]);
                        chaodaiList[dynastyList[chaoDaiIndex]["dynastyId"]].find("#swiper1" + dynastyList[chaoDaiIndex]["dynastyId"] + ">.swiper-wrapper").append($("#template1").html().replace("$img$","http://www.dadpat.com/"+chaodaiData[0]["image"][0]["imageUrl"]).replace("$content$",chaodaiData[0]["dynastyDescp"].split(";")[0]).replace("$audio$","http://www.dadpat.com/"+chaodaiData[0]['audio'][0]['attUrl']));
                        for( var j = 1; j < chaodaiData.length; ++j ){
                            chaodaiList[dynastyList[chaoDaiIndex]["dynastyId"]].find("#swiper1" + dynastyList[chaoDaiIndex]["dynastyId"] + ">.swiper-wrapper").append($("#template1").html().replace("$img$","http://www.dadpat.com/"+chaodaiData[j]["image"][0]["imageUrl"]).replace("$content$",chaodaiData[j]["dynastyDescp"].split(";")[0]).replace("$audio$","http://www.dadpat.com/"+chaodaiData[j]['audio'][0]['attUrl']));
                            swiperAllIn.push(chaodaiData[j]["dynastyDescp"].split(";")[0]);
                            swiperAll.push(chaodaiData[j]["dynastyDescp"].split(";")[1]);
                        }
                        $('.chaoDaiBox .swiper-wrapper').css({height:docuHeight+"px"});
                        $('.chaoDaiBox .swiper-slide').css({height:docuHeight+"px"});


                        if( shouSwiperIndex == chaoDaiIndex ) {
                            loadPage( initIndex != null && shouSwiperIndex == chaoDaiIndex ? initIndex : 0 );
                        }
                    }
                });
                //上下滑动
                SwiperList[dynastyList[i]["dynastyId"]] = new Swiper('#' + swiper1ID,{
                    direction : 'vertical',
                    observer: true,//修改swiper自己或子元素时，自动初始化swiper
                    // observeParents:true,
                    initialSlide: initIndex != null && shouSwiperIndex == i ? initIndex : 0,
                    lazy: {
                        loadPrevNext: true,
                        loadPrevNextAmount: 2
                    },
                    on:{
                        slideChangeTransitionStart: function () {
                            if( dynastyList[shouSwiperIndex]["dynastyId"] == dynastyId ){
                                //往session中存储
                                sessionStorage.setItem( dynastyList[shouSwiperIndex]["dynastyId"], this.activeIndex );
                            }
                            //滑动到下一故事时音频暂停重置，内容重新赋值
                            if(playEtext){
                                var playEtextText = playEtext[0].innerText;
                                // console.log(playAudio);
                                if( playAudio ){
                                    playAudio[0].pause();
                                    playAudio[0].load();
                                    playEtext[0].innerHTML = '<p>'+playEtextText+'</p>';
                                }
                            }
                            samllIndex = this.activeIndex;
                            loadPage(samllIndex);

                        },
                        slideChangeTransitionEnd: function () {

                        }
                    }
                });
            }
            /*左右滑动*/
            mySwiper = new Swiper('#swiper-container', {
                direction : 'horizontal',
                observer: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on:{
                    slideChangeTransitionStart:function(){
                        //滑动到下一朝代时音频暂停并重置，内容重新赋值
                        // console.log(playEtext);
                        if(playEtext){
                            var playEtextText = playEtext[0].innerText;
                            if( playAudio ){
                                playAudio[0].pause();
                                playAudio[0].load();
                                playEtext[0].innerHTML = '<p>'+playEtextText+'</p>';
                            }
                        }
                        shouSwiperIndex = this.activeIndex;
                        sonIndex = SwiperList[dynastyList[shouSwiperIndex]["dynastyId"]].activeIndex;
                        //console.log(sonIndex);
                        loadPage( sonIndex );
                    },
                    slideChangeTransitionEnd: function () {

                    }
                }
            });
            mySwiper.slideTo( shouSwiperIndex, 200, false );
        }
    });
    /*点击按钮播放音频，调用卡拉OK效果*/
    $('.audio').click(function(){
        var playEtextText = playEtext[0].innerText;
        if( playAudio[0].paused ){
            playAudio[0].play();
            _processK();
        }else{
            playAudio[0].pause();
            playAudio[0].load();
            playEtext[0].innerHTML = '<p>'+playEtextText+'</p>';
        }
    });
});
/*点击返回时空隧道页*/
$('.back2').click(function(){
    window.location.href="tunnel.html";
});

function loadPage( index ) {
    if( !mySwiper ) {
        return;
    }
    sonIndex = index;
    // console.log("大swiper索引值："+shouSwiperIndex+",小swiper索引值:"+sonIndex);
    var _etext = $("#swiper-container .swiper-container:eq(" + shouSwiperIndex +  ") .swiper-wrapper>div:eq(" + sonIndex +  ") .chaoDaiFu");
    var _audio = $("#swiper-container .swiper-container:eq(" + shouSwiperIndex +  ") .swiper-wrapper>div:eq(" + sonIndex +  ") audio");
    playEtext = _etext;
    playAudio = _audio;
    if( _etext.length != 1 || _audio.length != 1 ) {
        return;
    }
    var innText = _etext[0]['innerText'];
    for(var i=0;i< swiperAll.length;i++){
        if(innText == swiperAllIn[i]){
            /*================================================制作歌词 - 开始======================================================================================*/
            var lines = [];
            lines[0] = {};
            var str = swiperAll[i];  //歌词格式
            var regex = /^\[(\d*),(\d*)\]/;
            var result = regex.exec(str);
            var o = result[1];
            var d = result[2];
            var matchResult = str.match(/<\d*,\d*,\d*>[^<]*/g);
            lines[0] = {};
            lines[0]["ws"] = [];
            lines[0]["o"] = o;
            lines[0]["d"] = d;
            for( var j = 0; j < matchResult.length; ++j ) {
                var item = { };
                var temp = /<(\d*),(\d*),(\d*)>([^<]*)/.exec(matchResult[j]);
                item["w"] = temp[4];
                item["o"] = temp[1];
                item["d"] = temp[2];
                lines[0]["ws"].push(item);
            }
            var pObj = lines[0]['ws'];
            var pOb = '';
            for(var k=0;k<pObj.length;k++){
                pOb += "<p>" + pObj[k]['w'] + "</p>";
            }
            var wstoes = function(words) {
                var ps = "";
                for (var i = 0; i < words.length; i++) {
                    ps += "<p>" + words[i]['w'] + "</p>";
                }
                _etext[0]['innerHTML'] = ps;
                var _eps = _etext[0]['children'];
                for (var i = 0; i < words.length; i++) {
                    _eps[i].offset = words[i]['o'];
                    _eps[i].duration = words[i]['d'];
                }
                return _eps;
            };
            var step = 30;
            var timer;
            var _processw = function(_eps, _index, _ps, _process, pos, count){
                _ep = _eps[_index];
                if (count >= pos) {
                    _process += _ps;
                    if(_ep){
                        _ep.style.backgroundImage = "-webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%), -webkit-linear-gradient(left, #fff " + _process + "%, #00f 0%)";
                    }
                    if (_process >= 99) {
                        if ((_index+1) >= _eps.length) { //该句结束退出
                            return;
                        }
                        _index++;
                        var ts = Math.round(_eps[_index].duration/step)==0?1:Math.round(_eps[_index].duration/step);
                        _ps = 100/ts;
                        _process = 0;
                        pos = Math.round(_eps[_index].offset/step);
                    }
                }
                count++;
                timer = setTimeout(_processw.bind(this, _eps, _index, _ps, _process, pos, count), step);
            };
            /*处理单行*/
            var _processL = function(words) {
                var _eps = wstoes(words);
                clearTimeout(timer); //清除上一行因为页面渲染延迟没有处理完的定时器
                _processw(_eps, 0, 100/Math.round(_eps[0].duration/step), 0, Math.round(_eps[0].offset/step), 0);
            };
            /*处理全部krc歌词*/
            var timers = [];
            _processK = function() {
                for (var i = 0; i < lines.length; i++) {
                    var timer = setTimeout(_processL.bind(this, lines[i]['ws']), lines[i]['o']);
                    timers.push(timer);
                }
            };
            /*=============================================================结束==========================================================  ========================*/
        }
    }
}




