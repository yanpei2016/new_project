/**
 * Created by lenovo on 2017/9/22.
 */

window.onload = function () {
    var slideItem = document.getElementsByClassName("slide-item"),
        slideList = document.getElementsByClassName("slide-list")[0],
        slideWrap = document.getElementsByClassName("slide-wrap")[0],
        slidePrevBtn = document.getElementsByClassName("slide-prev-btn")[0],
        slideNextBtn = document.getElementsByClassName("slide-next-btn")[0],

        startX,  //鼠标初始位置
        endX,    //鼠标移动时的位置
        disX,    //鼠标移动的位置差
        len = slideItem.length, //轮播元素个数
        itemWidth = slideItem[0].clientWidth, //单个轮播元素的宽度
        halfWidth = itemWidth/3,
        imgIndex = 0,
        timer = "",

        //可控参数
        loop = true,  //循环播放
        crateDots = true,  //创建导航点
        autoplay = true, //自动轮播
        autoPlayTime = 2000; //自动轮播时间间隔

        //初始化silde的宽度
        slideList.style.width = itemWidth * len + "px";
        slideWrap.style.width = itemWidth + "px";
        // slideItem[imgIndex].classList.add("active");

        if(crateDots){
            var strWrap = document.createElement("ul"),
                strDot = document.createElement("li");
                strWrap.className = "slide-dots-wrap";
                strDot.className = "slide-dots-item";
                for(var i = 0;i < len; i++){
                    strDot
                }
                strWrap.appendChild(strDot);
                slideWrap.appendChild(strWrap);
        }

        //自动轮播
        if(autoplay){
            autoPlay();
        }

        //鼠标按下之后 停止自动播放
        slideWrap.onmousedown = function (e) {
            //停止自动播放
            clearInterval(timer);
            e =e || window.event;
            //禁止浏览器默认的图片拖拽效果
            e.preventDefault();
            startX = e.offsetX;
            console.log("鼠标移入目标元素")
        };
        slideWrap.onmousemove = function (e) {
            e =e || window.event;
            endX = e.offsetX;
            if(!startX){
                return
            }
            disX = endX - startX;
            slideList.style.left = -itemWidth*imgIndex+disX+ "px";

        };
        //鼠标松开之后  同步轮播图位置
        slideWrap.onmouseup = function (e) {
            clearInterval(timer);
            e =e || window.event;
            endX = e.offsetX;
            disX = endX - startX;
            console.log(disX);
            console.log(imgIndex);
            if(Math.abs(disX)<halfWidth){
                slideList.style.left = -itemWidth*imgIndex+ "px";
            }

            if(disX>halfWidth){
                if(imgIndex == 0){
                    slidePrevBtn.classList.add("slide-disable-btn");
                }else{
                    imgIndex--;
                }
                slideList.style.left = -itemWidth*(imgIndex)+ "px";
            }

            if(disX<-halfWidth){
                if(imgIndex == len-1){
                    slideNextBtn.classList.add("slide-disable-btn");
                }else{
                    imgIndex++;
                    slidePrevBtn.classList.remove("slide-disable-btn")
                }
                slideList.style.left = -itemWidth*(imgIndex)+ "px";
            }

           // //开启自动播放
            autoPlay();
            startX = "";
        };

        //上一张按钮的点击事件
        slidePrevBtn.onclick= function () {
            imgIndex--;
            if(imgIndex==0){
                this.classList.add("slide-disable-btn")
            }
            if(imgIndex<0){
                imgIndex=0;
                return
            }
            slideNextBtn.classList.remove("slide-disable-btn");
            slideList.style.left = -itemWidth*imgIndex + "px";
        };

        //下一张按钮的点击事件
        slideNextBtn.onclick = function () {
            imgIndex++;
            if(imgIndex==len-1){
                this.classList.add("slide-disable-btn")
            }
            if(imgIndex>=len){
                imgIndex = len-1;
                return
            }
            slidePrevBtn.classList.remove("slide-disable-btn");
            slideList.style.left = -itemWidth*imgIndex + "px";
        };



        //自动播放函数
        function autoPlay() {
            timer = setInterval(function () {
                imgIndex++;
                if(imgIndex==len-1){
                    slideNextBtn.classList.add("slide-disable-btn")
                }else{
                    slideNextBtn.classList.remove("slide-disable-btn")
                }
                if(imgIndex == 0){
                    slidePrevBtn.classList.add("slide-disable-btn")
                }else{
                    slidePrevBtn.classList.remove("slide-disable-btn")
                }
                if(imgIndex>=len){
                    imgIndex = 0;
                }
                slideList.style.left = -itemWidth*imgIndex + "px";
            },autoPlayTime)
        }
};