const cheerio = require('cheerio')
const moment = require('moment')

hexo.extend.filter.register('after_render:html', function (locals) {
  const $ = cheerio.load(locals)
  const post = $('#posts-chart')
  const tag = $('#tags-chart')
  const category = $('#categories-chart')
  let htmlEncode = false

  // 如果页面存在图表容器
  if (post.length > 0 || tag.length > 0 || category.length > 0) {

    if (post.length > 0 && $('#postsChart').length === 0) {
      if (post.attr('data-encode') === 'true') htmlEncode = true
      post.after(postsChart(post.attr('data-start')))
    }

    if (tag.length > 0 && $('#tagsChart').length === 0) {
      if (tag.attr('data-encode') === 'true') htmlEncode = true
      tag.after(tagsChart(tag.attr('data-length')))
    }

    if (category.length > 0 && $('#categoriesChart').length === 0) {
      if (category.attr('data-encode') === 'true') htmlEncode = true
      category.after(categoriesChart())
    }

    if (htmlEncode) {
      return $.root().html().replace(/&amp;#/g, '&#')
    } else {
      return $.root().html()
    }
  } else {
    return locals
  }
}, 15)

/* -------------------------- 文章统计 -------------------------- */
function postsChart(startMonth) {
  const startDate = moment(startMonth || '2020-01')
  const endDate = moment()

  const monthMap = new Map()
  const dayTime = 3600 * 24 * 1000
  for (let time = startDate; time <= endDate; time += dayTime) {
    const month = moment(time).format('YYYY-MM')
    if (!monthMap.has(month)) monthMap.set(month, 0)
  }

  hexo.locals.get('posts').forEach(post => {
    const month = post.date.format('YYYY-MM')
    if (monthMap.has(month)) monthMap.set(month, monthMap.get(month) + 1)
  })

  const monthArr = JSON.stringify([...monthMap.keys()])
  const monthValueArr = JSON.stringify([...monthMap.values()])

  return `
  <script id="postsChart">
    document.addEventListener('DOMContentLoaded', () => {
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)';
      var dom = document.getElementById('posts-chart');
      if (!dom) return;
      if (echarts.getInstanceByDom(dom)) echarts.getInstanceByDom(dom).dispose();
      var postsChart = echarts.init(dom, 'light');
      postsChart.setOption({
        title: { text: '文章发布统计图', x: 'center', textStyle: { color: color } },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', boundaryGap: false, data: ${monthArr}, axisLabel: { color: color }, axisLine: { lineStyle: { color: color } } },
        yAxis: { type: 'value', axisLabel: { color: color }, axisLine: { lineStyle: { color: color } } },
        series: [{
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{ offset:0, color:'rgba(128,255,165)'},{offset:1,color:'rgba(1,191,236)'}]) },
          data: ${monthValueArr}
        }]
      });
      window.addEventListener('resize', () => postsChart.resize());
    });
  </script>`
}

/* -------------------------- 标签统计 -------------------------- */
function tagsChart(len) {
  const tagArr = hexo.locals.get('tags').map(tag => ({ name: tag.name, value: tag.length, path: tag.path }))
  tagArr.sort((a, b) => b.value - a.value)
  const dataLength = Math.min(tagArr.length, len) || tagArr.length
  const tagNameArrJson = JSON.stringify(tagArr.slice(0, dataLength).map(t => t.name))
  const tagArrJson = JSON.stringify(tagArr)

  return `
  <script id="tagsChart">
    document.addEventListener('DOMContentLoaded', () => {
      var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)';
      var dom = document.getElementById('tags-chart');
      if (!dom) return;
      if (echarts.getInstanceByDom(dom)) echarts.getInstanceByDom(dom).dispose();
      var tagsChart = echarts.init(dom, 'light');
      tagsChart.setOption({
        title: { text: 'Top ${dataLength} 标签统计图', x: 'center', textStyle: { color: color } },
        xAxis: { type: 'category', data: ${tagNameArrJson}, axisLabel: { color: color }, axisLine: { lineStyle: { color: color } } },
        yAxis: { type: 'value', axisLabel: { color: color }, axisLine: { lineStyle: { color: color } } },
        series: [{ type: 'bar', data: ${tagArrJson} }]
      });
      window.addEventListener('resize', () => tagsChart.resize());
    });
  </script>`
}

/* -------------------------- 分类统计（固定旭日图） -------------------------- */
function categoriesChart() {
  const categoryArr = hexo.locals.get('categories').map(category => ({
    name: category.name,
    value: category.length,
    path: category.path,
    id: category._id,
    parentId: category.parent || '0'
  }))

  function translateListToTree(data, parent) {
    let tree = []
    data.forEach(item => {
      if (item.parentId == parent) {
        let obj = { ...item }
        const children = translateListToTree(data, item.id)
        if (children.length) obj.children = children
        tree.push(obj)
      }
    })
    return tree
  }

  const categoryArrJson = JSON.stringify(translateListToTree(categoryArr, '0'))

  return `
  <script id="categoriesChart">
    document.addEventListener('DOMContentLoaded', () => {
      var dom = document.getElementById('categories-chart');
      if (!dom) return;
      if (echarts.getInstanceByDom(dom)) echarts.getInstanceByDom(dom).dispose();
      var categoriesChart = echarts.init(dom, 'light');
      categoriesChart.setOption({
        title: { text: '文章分类统计图', x: 'center', textStyle: { color: '#4c4948' } },
        tooltip: { trigger: 'item' },
        series: [{
          type: 'sunburst',
          data: ${categoryArrJson},
          radius: ['15%', '90%'],
          center: ['50%', '55%'],
          sort: 'desc',
          itemStyle: { borderColor: '#fff', borderWidth: 2, emphasis: { focus: 'ancestor', shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
        }]
      });
      window.addEventListener('resize', () => categoriesChart.resize());
    });
  </script>`
}
