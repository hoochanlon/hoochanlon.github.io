// Hexo After Render 插件：在页面生成时插入 JS
const cheerio = require('cheerio');

hexo.extend.filter.register('after_render:html', function (locals) {
  const $ = cheerio.load(locals);
  const container = $('#tiantianquan-categories'); // 页面容器
  let htmlEncode = false;

  if (container.length > 0 && $('#doughnutCategoriesChart').length === 0) {
    if (container.attr('data-encode') === 'true') htmlEncode = true;
    container.after(doughnutCategoriesChart());
  }

  if (htmlEncode) {
    return $.root().html().replace(/&amp;#/g, '&#');
  } else {
    return $.root().html();
  }
}, 15);

function doughnutCategoriesChart() {
  // 获取 Hexo categories 数据
  const categories = hexo.locals.get('categories');
  
  // 获取所有分类数据
  const allCategories = categories.map(category => ({
    name: category.name,
    value: category.length,
    path: category.path
  }));

  // 按文章数量降序排序
  const sortedCategories = allCategories.sort((a, b) => b.value - a.value);
  const categoriesJson = JSON.stringify(sortedCategories);

  return `
  <script id="doughnutCategoriesChart">
    document.addEventListener('DOMContentLoaded', () => {
      const dom = document.getElementById('tiantianquan-categories');
      if (!dom) return;

      if (echarts.getInstanceByDom(dom)) echarts.getInstanceByDom(dom).dispose();
      const chart = echarts.init(dom, 'light');

      const categoriesData = ${categoriesJson};
      
      // 生成更丰富的颜色数组
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#7FB3D5', '#D7BDE2',
        '#76D7C4', '#F9E79F', '#CCD1D1', '#AED6F1', '#FAD7A0'
      ];

      chart.setOption({
        title: { 
          text: '文章分类分布', 
          left: 'center',
          top: '10px',
          textStyle: { 
            color: '#4c4948',
            fontSize: 16,
            fontWeight: 'bold'
          } 
        },
        tooltip: { 
          trigger: 'item',
          formatter: '{b}: {c}篇 ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '10%',
          top: 'center',
          height: '80%',
          textStyle: { 
            color: '#4c4948',
            fontSize: 12
          },
          pageTextStyle: {
            color: '#4c4948'
          },
          formatter: function (name) {
            // 在图例中显示文章数量
            const data = categoriesData.find(item => item.name === name);
            return data ? name + ': ' + data.value + '篇' : name;
          }
        },
        color: colors,
        series: [{
          name: '文章分类',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            borderRadius: 5
          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            fontSize: 12,
            color: '#fff',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          },
          labelLine: {
            show: false
          },
          emphasis: {
            scale: true,
            scaleSize: 5,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: categoriesData
        }]
      });

      // 点击图例筛选
      chart.on('legendselectchanged', function (params) {
        const selected = params.selected;
        let selectedCount = 0;
        for (const key in selected) {
          if (selected[key]) selectedCount++;
        }
        
        // 如果只剩下一个分类被选中，突出显示
        if (selectedCount === 1) {
          chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: categoriesData.findIndex(item => item.name === Object.keys(selected).find(key => selected[key]))
          });
        } else {
          chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0
          });
        }
      });

      // 点击扇形跳转
      chart.on('click', function(event) {
        if(event.data.path) {
          window.location.href = '/' + event.data.path;
        }
      });

      window.addEventListener('resize', () => chart.resize());
    });
  </script>`;
}