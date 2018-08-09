/*隧道、朝代的宽高*/
var docuWidth = document.documentElement.clientWidth; //可视区域的宽度
var docuHeight = document.documentElement.clientHeight; //可视区域的高度
document.querySelector('.suiDao').style.height = docuHeight + 'px';
document.querySelector('.suiDao').style.width = docuWidth + 'px';
document.querySelector('.chaoDai').style.height = docuHeight + 'px';
document.querySelector('.chaoDai').style.width = docuWidth + 'px';


//js获取url参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

$.ajax({
    type:"post",
    url:"http://www.dadpat.com/dynasty/getAllList.do",
    dataType:"jsonp", //以键/值对的形式
    async:true,
    success:function(data){
        console.log(data.data);
        var datas = data.data;
        var  arrAll = [];
        for(var i=0;i<datas.length;i++){
            var datasLeng = datas[i].dynastyCover;
            if(datasLeng != null){
                for(var a=0;a<datasLeng.length;a++){
                    arrAll.push(datasLeng[a]);
                }
            }
        }
        $('.chaoDai').append('<div class="chaoDai1" style="display: block; position: absolute;top: 0;width: 100%;height: 100%;animation:excircle 21s infinite linear;z-index: 200;"><a href="details.html?dynastyId='+arrAll[1].animalId+'"><img src="http://www.dadpat.com/'+arrAll[1].attUrl+'" class="img1"></a></div>');
        $('.chaoDai').append('<div class="chaoDai2" style="position: absolute;top: 0;width: 100%;height: 100%;animation:excircle 21s infinite linear;z-index: 150;"><a href="details.html?dynastyId='+arrAll[2].animalId+'"><img src="http://www.dadpat.com/'+arrAll[2].attUrl+'" class="img2"></a></div>');
        $('.chaoDai').append('<div class="chaoDai3" style="position: absolute;top: 0;width: 100%;height: 100%;animation:excircle 21s infinite linear;z-index: 120"><a href="details.html?dynastyId='+arrAll[3].animalId+'"><img src="http://www.dadpat.com/'+arrAll[3].attUrl+'" class="img3"></a></div>');

        /*朝代*/
        var chaoDaiC = document.querySelector('.chaoDai');
        setInterval(function () {
            var name1 = document.getElementsByClassName("chaoDai1");
            chaoDaiC.removeChild(name1[0]);
            var random = Math.floor(Math.random()* arrAll.length);
            // console.log(random)
            //console.log(arrAll[random].animalId);
            $('.chaoDai').append('' +
                '<div class="chaoDai1" style="display: block; position: absolute;top: 0;width: 100%;height: 100%;animation:excircle 21s infinite linear;">' +
                '<a href="details.html?dynastyId='+arrAll[random].animalId+'">' +
                '<img src="http://www.dadpat.com/'+arrAll[random].attUrl+'" style="left:-2%;top:-19%;animation:fillet 21s infinite linear ;z-index: 200">' +
                '</a>' +
                '</div>');
        },21000);
        setTimeout(function () {
            var chaoDai2 = document.querySelector('.chaoDai2');
            chaoDai2.style.display = 'block';
            setInterval(function () {
                var name2 = document.getElementsByClassName("chaoDai2");
                chaoDaiC.removeChild(name2[0]);
                var random = Math.floor(Math.random()* arrAll.length);
                $('.chaoDai').append('' +
                    '<div class="chaoDai2" style="display: block; position: absolute;top: 0;width: 100%;height: 100%;animation:excircle 21s infinite linear;">' +
                    '<a href="details.html?dynastyId='+arrAll[random].animalId+'">' +
                    '<img src="http://www.dadpat.com/'+arrAll[random].attUrl+'" style="left:17%;top:60%;animation:fillet 21s infinite linear ;z-index: 150">' +
                    '</a>' +
                    '</div>');
            },21000);
        },7000);
        setTimeout(function () {
            var chaoDai3 = document.querySelector('.chaoDai3');
            chaoDai3.style.display = 'block';
            setInterval(function () {
                var name3 = document.getElementsByClassName("chaoDai3");
                chaoDaiC.removeChild(name3[0]);
                var random = Math.floor(Math.random()* arrAll.length);
                $('.chaoDai').append('' +
                    '<div class="chaoDai3" style="display: block; position: absolute;top: 0;width: 100%;height: 100%;animation:excircle 21s infinite linear;">' +
                    '<a href="details.html?dynastyId='+arrAll[random].animalId+'">' +
                    '<img src="http://www.dadpat.com/'+arrAll[random].attUrl+'" style="left:48%;top:-33%;animation:fillet 21s infinite linear ;z-index: 120">' +
                    '</a>' +
                    '</div>');
            },21000);
        },14000);
    }
});
