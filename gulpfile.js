/**
 *
 * Created by lenovo on 2017/9/6.
 */

var gulp = require("gulp"),                     //初始化gulp
    sass = require("gulp-sass"),                //sass编译
    rename = require("gulp-rename"),            //重命名
    minifyCss = require("gulp-minify-css"),     //css文件压缩
    autoprefixer = require("gulp-autoprefixer"),//自动补全css兼容性前缀
    sourceMaps = require("gulp-sourcemaps"),    //记录生成的scss行数 便于调试时查找样式文件

    uglify = require("gulp-uglify"),            //压缩js文件
    concat = require("gulp-concat"),            //合并js
    jshint =require("gulp-jshint"),             //js校验 当js代码编译出现错误是会在命令行中 有错误提示

    rev = require("gulp-rev-append"),           //自动添加md5版本号
    clean =  require("gulp-clean"),             //删除之前编译过的文件
    browserSync = require("browser-sync"),      //实时刷新页面
    reload = browserSync.reload,
    notify = require("gulp-notify");            //提示编译进度


var path = {
    cssIn:["dev/sass/*.scss","dev/sass/**/*.scss"],
    cssOut:"assets/styles/",
    jsIn:"dev/js/*.js",
    jsOut:"assets/scripts/",
    imgIn:"dev/images/*",
    imgOut:"assets/images/"
};

//监听css任务
gulp.task("styles",["revTest"],function () {
        return gulp.src(path.cssIn)
        .pipe(sourceMaps.init())  //记录生成的scss行数

        .pipe(sass()) //编译
        .pipe(autoprefixer({
            browsers: ['last 2 versions','Android >= 4.0'],
            cascade: false,//是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:false //是否去掉不必要的前缀 默认：true
        }))//自动补全css兼容新前缀
        .pipe(minifyCss()) //压缩
        .pipe(rename({suffix:".min"})) //添加压缩文件的后缀名

        .pipe(sourceMaps.write('map'))//生成map文件

        .pipe(gulp.dest(path.cssOut))
        .pipe(notify({message :"css task success"}))
});

//监听js任务
gulp.task("scripts",["revTest"],function () {
    return gulp.src(path.jsIn)
        .pipe(sourceMaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter("default"))   //js语法校验
        .pipe(concat("index.js"))       //合并到index.js文件里面
        .pipe(rename({suffix:".min"}))  //添加压缩的后缀名
        .pipe(uglify())                 //压缩js文件
        .pipe(sourceMaps.write("map"))
        .pipe(gulp.dest(path.jsOut))    //输出文件
        .pipe(notify({message:"js task success"}))
});

//监听 images任务
gulp.task("images",["revTest"],function () {
    return gulp.src(path.imgIn)
        .pipe(gulp.dest(path.imgOut))
        .pipe(notify({message:"img task success"}))
})

//监听html任务 自动添加版本号
gulp.task("revTest",function () {
    return gulp.src("assets/html/index.html")
        .pipe(rev())
        .pipe(gulp.dest("assets/html/"))
        .pipe(notify({message:"html add rev success"}))
});

//监听所有可能变动的文档
gulp.task("watch",function () {
    gulp.watch(path.cssIn,["styles"]);
    gulp.watch(path.jsIn,["scripts"]);
    gulp.watch("assets/html/index.html",["revTest"]);
});

//启动静态服务器
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(['assets/*', 'assets/**/*', 'assets/**/**/*'], {cwd: './'}, reload);
});

//此处 后编译的文件会直接覆盖前编译的文件  所以不需要建立clean任务
// gulp.task("cleanCss",function () {
//     return gulp.src(path.cssOut,{force: true})
//         .pipe(clean())
//         .pipe(notify({message:"css clean success"}))
// });
//
// gulp.task("cleanJs",function () {
//     return gulp.src(path.jsOut)
//         .pipe(clean())
//         .pipe(notify({message:"js clean success"}))
// });

//创建默认的gulp任务
gulp.task("default",function () {
    gulp.start("styles",'watch','serve','scripts',"images")
});



