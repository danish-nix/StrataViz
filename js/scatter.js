
export const scatterPlot= (selection,props) => {
  const {
    xValue,
    xAxisLabel,
    yValue,
    circleRadius,
    yAxisLabel,
    margin,
    width,
    height,
    dataRow,

  } = props;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  let storageSample;
  let sampledData;

  storageSample = sessionStorage.getItem('sampledData');

  sampledData = JSON.parse(storageSample);
  sampledData.forEach(data => {
    for (let key in data) {
      if (Number(data[key]))
        data[key] = +data[key];
    }
    ;
  });


  /**
   * Initialise X and Y Axis
   * */
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataRow, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataRow, yValue))
    .range([innerHeight, 0])
    .nice();


  /**
   * Create a chart container
   * */


  const g = selection
    .selectAll('.container').data([null]);

  const gEnter = g.enter().append('g')
    .attr('class', 'container');

  gEnter.merge(g)
    .attr('transform', `translate(${margin.left},${margin.top})`);


  /**
   * Create X-Axis and Y-Axis data and label
   * */


  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
    .append('g')
    .attr('class', 'y-axis');

  yAxisG.merge(yAxisGEnter)
    .call(yAxis)
    .selectAll('.domain').remove();

  const yAxisLabelText = yAxisGEnter
    .append('text')
    .attr('class', 'axis-label')
    .attr('y', -92)
    .attr('fill', 'black')
    .attr('font-size','5em')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
    .attr('x', -innerHeight / 2)
    .text(yAxisLabel);

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(20);

  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
    .append('g')
    .attr('class', 'x-axis');

  xAxisG.merge(xAxisGEnter)
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .selectAll('.domain').remove();

  const xAxisLabelText = xAxisGEnter
    .append('text')
    .attr('class', 'axis-label')
    .attr('y', 86)
    .attr('fill', 'black')
    .attr('font-size','5em')
    .merge(xAxisG.select('.axis-label'))
    .attr('x', innerWidth / 2)
    .text(xAxisLabel);




  const circles = g.merge(gEnter)
    .selectAll('circle')
    .data(dataRow);

  circles.enter().append('circle')
    .attr('cx', innerWidth /2)
    .attr('cy', innerHeight / 2)
    .attr('r', 0)
    .merge(circles)
    .transition().duration(2000)
    .delay((d, i) => i * 10)
    .attr('class','scatterCircle')
    .attr('cy', d => yScale(yValue(d)))
    .attr('cx', d => xScale(xValue(d)))
    .attr('r', circleRadius)
    .attr('fill','#e61919')
    .attr('opacity','0.3');
  circles
    .on("mouseover", function (d) {
      div.transition()
        .duration(200)
        .style("opacity", 0.9);

      div.html(
        "Y-Axis:" + d.yValue + "<br/>");

      div.style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 30) + "px")

    })
    .on("mouseout", function (d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .call(d3.zoom().on("zoom",function() {
      // Using d3 mouse events, dynamically update translation and scale.
      d3.selectAll("circles").attr("transform","translate("+
        d3.event.translate.join(",")+")scale("+d3.event.scale+")");
    }));



  document.getElementById('original').addEventListener("click", () => {
    update(dataRow);
  });
  document.getElementById('sample').addEventListener("click", () => {
    update(sampledData);
  });


  window.addEventListener("load", defaultColor, false);

  function defaultColor() {
    var colorChoose = document.getElementById("labelColor");
    var colorChoose2 = document.getElementById("scaleColor");
    var colorChoose3 = document.getElementById("dataColor");
    var colorChoose4 = document.getElementById("backgroundColor");
    var colorChoose5 = document.getElementById("gridColor");
    colorChoose.addEventListener("input", updateColor, false);
    colorChoose2.addEventListener("input", updateColor2, false);
    colorChoose3.addEventListener("input", updateColor3, false);
    colorChoose4.addEventListener("input", updateColor4, false);
    colorChoose5.addEventListener("input", updateColor5, false);
    colorChoose.select();
  }

  function updateColor(event) {
    var p = document.getElementsByClassName("axis-label")[0];
    var q = document.getElementsByClassName("axis-label")[1];

    if (p) {
      p.style.fill = event.target.value;
      q.style.fill = event.target.value;
    }
  }

  function updateColor2(event) {
    var r = document.getElementsByClassName("tick")[0];

    if(r){
      r.style.fill = event.target.value;
    }
  }

  function updateColor3(event) {
    var r = document.getElementsByClassName("scatterCircle");

    if(r){
      r.style.fill = event.target.value;
    }
  }

  function updateColor4(event) {
    var r = document.getElementsByClassName("scatterPlot")[0];

    if(r){
      r.style.backgroundColor = event.target.value;
    }
  }

  function updateColor5(event) {
    var r = document.getElementsByClassName("")[0];

    if(r){
      r.style.fill = event.target.value;
    }
  }





}

