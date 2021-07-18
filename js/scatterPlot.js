/**
 * Importing Data
 * */

  import { dropdownMenu } from './dropdownMenu.js';
  import { scatterPlot } from './scatter.js';

  let dataRow;
  let storageData;
  let storageColumn;
  let sampleColumn;
  let changedColumn;
  let deleteData;

  storageData= sessionStorage.getItem('originalData');
  storageColumn = sessionStorage.getItem('columnsJson');

  dataRow  = JSON.parse(storageData);
  dataRow.forEach(data => {
    for (let key in data) {
      if (Number(data[key]))
        data[key] = +data[key];

    };
  });
  console.log(dataRow);
  deleteData = JSON.parse(storageData);
  deleteData.forEach(deleteData => {
    for (let key in deleteData) {
      if (Number(deleteData[key]))
        delete deleteData[key]

    };
  });

  changedColumn = Object.keys(deleteData[0]);
  sampleColumn = JSON.parse(storageColumn);
  sampleColumn.forEach(data => {
    for(let keys in data){
      _.pullAll(sampleColumn,changedColumn);
    }

  });


  const svg = d3.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');

  let xColumn = sampleColumn[0];
  let yColumn = sampleColumn[1];

  const onXColumnClicked = column =>{
    xColumn = column;
    render();
  };

  const onYColumnClicked = column =>{
    yColumn = column;
    render();
  };


  const render = () => {
    d3.select('#x-menu')
      .call(dropdownMenu,{
        options:sampleColumn,
        onOptionClicked: onXColumnClicked,
        selectedOption : xColumn
      });

    d3.select('#y-menu')
      .call(dropdownMenu,{
        options:sampleColumn,
        onOptionClicked: onYColumnClicked,
        selectedOption : yColumn
      });

    svg.call(scatterPlot,{
      xValue : d => d[xColumn],
      xAxisLabel : xColumn,
      yValue : d => d[yColumn],
      circleRadius : 10,
      yAxisLabel : yColumn,
      margin : { top: 20, right: 40, bottom: 90, left: 150 },
      width,
      height,
      dataRow
    });
  };
  render(dataRow);


