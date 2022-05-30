export function getDynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
 };

export function getChartData(stats) {
    if(stats) {
        return {
            labels: stats.map(item => item.url),
            datasets:[{
                label: 'Website stats',
                data: stats.map(item => item.timeInSec),
                backgroundColor: stats.map(item => getDynamicColors()),
                hoverOffset: 4
            }]
        }
        //return [['Webiste', 'time spent'], ...stats.map(item => [item.url, item.timeInSec])]
    }
}