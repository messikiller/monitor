$(function () {
    $('#container').highcharts({
        chart: {
            //定义图表类型类型
            type: 'areaspline',
            zoomType: 'x',
            spacingRight: 50
        },
        title: {
            text: 'monitor'
        },
        subtitle: {
            text: 'usage percentage of linux system memory'
        },
        //右下角版权信息
        credits: {
            text: 'messikiller',
            href: '#'
        },
        //定义X轴属性
        xAxis: {
            //X轴数据定义成时间格式
            type: 'datetime',
            //绘图像素间隔
            tickPixelInterval: 100
        },
        //定义Y轴属性
        yAxis: {
            title: {
                text: 'memory usage percentage'
            },
            //Y轴刻度
            tickInterval: 0.1,
            min: 0,
            max: 1,
            //将Y轴数据由小数格式化为百分数
            labels: {
                formatter: function(){
                    return this.value*100+'%';
                }
            }
        },
        //定义悬浮提示框内容
        tooltip: {
            //鼠标经过图表中的点时出现十字网格线
            crosshairs: {
                width: 1,
                //网格线颜色
                color: '#058DC7' 
            },
            //tooltip内容格式化显示
            formatter: function(){
                return  '<b>时间:</b>'+Highcharts.dateFormat('%H:%M:%S', this.x) +'<br />'+'<b>'+ this.series.name +':</b>'+ this.y*100+'%'; 
            },
            //固定tooltip在图中的位置
            positioner: function () {
                return { x: 950, y: 80 };
            }
        },
        //禁止图例
        legend: {
            enabled: false
        },
        //绘图选项，将图形区域使用渐变颜色填充
        plotOptions: {
            areaspline: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: true
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        //初始数据填充成0
        series: [{
            name: '内存使用率',
            data: (function(){
                var data=[];
                var time = (new Date()).getTime();
                var i;
                //填充空数组
                for (i = -60; i <= 0; i++) {                                    
                    data.push({                                                 
                        x: time + i * 1000,                                     
                        y: 0                                    
                    });                                                         
                }                                                              
                return data; 
            })(),
            pointInterval: 1000
        }]
    });
});  

//highcharts默认使用UTC，坐标轴时间与中国时区相差8小时，禁止UTC可以使显示的时间与中国时间同步
Highcharts.setOptions({ global: { useUTC: false } });           

//间隔1000ms（1s）发起一次请求，填充一组数据
var timehandler=setInterval("request_data()",1000);

//点击开始按钮，重新发起请求
$("#start_btn").click(function(){
    clearInterval(timehandler);
    timehandler=setInterval("request_data()",1000);
});

//点击停止按钮后，冻结请求函数
$("#stop_btn").click(function(){
    clearInterval(timehandler);
});

//定义发起请求并填充数据的函数
function request_data()
{
    $.ajax({
        url: './action/getServerMeminfo.action.php?q=meminfo',
        type: 'GET',
        success: function(data){
            var chart = $('#container').highcharts();
            var x = (new Date()).getTime();    
            var y = Number(data);
            chart.series[0].addPoint([x,y], true, true);
        } 
    });
}