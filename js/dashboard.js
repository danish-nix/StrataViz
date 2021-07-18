
let data;
let dataJson;
let columnJson;
let dataRow;
let sampleColumn;
let afterSample

/**

 Parsing Excel File

 **/

  //Rendering Data
let selectedFile;
let upload = document.getElementById('upload_file');
upload.addEventListener("change", (event) => {

  selectedFile = event.target.files[0];

  if(selectedFile){
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);

    fileReader.onload = (event) => {
      let data = event.target.result;
      let wb = XLSX.read(data,{type:"binary"});

      wb.SheetNames.forEach(sheet =>{
        dataRow = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
      });

      dataJson = JSON.stringify(dataRow);
      sessionStorage.setItem('originalData',dataJson);
    }
  }

  //Rendering Columns
  readXlsxFile(upload.files[0]).then(loadedData => {
    data = loadedData;
    let totalData= _.size(data);
    document.getElementById("dataCount").innerHTML = "Your total number of data: " + totalData;

    sampleColumn = data[0];
    columnJson = JSON.stringify(sampleColumn);
    sessionStorage.setItem('columnsJson',columnJson);
    sessionStorage.setItem('columnsData',sampleColumn);

    var select = document.getElementById("columns");

    for(var i=0;i<sampleColumn.length;i++){

      var option = document.createElement("OPTION"),
        txt = document.createTextNode(sampleColumn[i]);
      option.appendChild(txt);
      option.setAttribute("value",sampleColumn[i]);
      select.insertBefore(option,select.lastChild);
    }


  });
});


/**

 Parsing Form Data

 **/

  document.addEventListener('DOMContentLoaded',() => {
    document.getElementById('input-form').addEventListener('submit',handleForm);
  });

  function handleForm(ev) {
    ev.preventDefault(); //stop the page reloading
    //console.dir(ev.target);
    let myForm = ev.target;
    let fd = new FormData(myForm);

    //add more things that were not in the form
    fd.append('api-key', 'myApiKey');

    //look at all the contents
    for (let key of fd.keys()) {
      console.log(key, fd.get(key));
    }
    let json = convertFD2JSON(fd);

    //send the request with the formdata
    let url = 'http://localhost:63342/';
    let h = new Headers();
    h.append('Content-type', 'application/json');

    let req = new Request(url, {
      headers: h,
      body: json,
      method: 'POST',
    });
    //console.log(req);
    fetch(req)
      .then((res) => res.json())
      .then((data) => {
        console.log('Response from server');
        console.log(data);
      })
      .catch(console.warn);

    /** Acquiring dataRow to sample data by groups*/

    let userNoOfData = document.getElementById('dataNumber').value;
    let categories = document.getElementById('columns').value;

    sessionStorage.setItem('categories',categories);
    let selectedColumn = document.getElementById('columns').value;
    let selectedColumnJSON = JSON.stringify(selectedColumn);

    console.log("User Input: "+userNoOfData+" data");
    var output = _(dataRow) //begin chaining syntax
      .groupBy(selectedColumn)
      .map(function (group) {
        var sampleCategories;
        console.log("User Data: "+userNoOfData+" Total: "+_.size(dataRow)+" Group Size: "+_.size(group))
        sampleCategories = Math.round( sampleCategories = userNoOfData/_.size(dataRow) * _.size(group));
        console.log("Total Sampled Data: "+sampleCategories);
        if(sampleCategories === 0){
          return _.sampleSize(group, 1);
        }else
        return _.sampleSize(group, sampleCategories); //sample n items randomly
      })
      .flatten() //flatten array of arrays into a single array
      .value();
      console.log("Sum of Sampled Data: "+output.length);


      afterSample = JSON.stringify(output);
    sessionStorage.setItem('sampledData',afterSample);

      window.location.href="../charts/chartList.html";

  }

  function convertFD2JSON(formData) {
    let obj = {};
    for (let key of formData.keys()) {
      obj[key] = formData.get(key);
    }
    return JSON.stringify(obj);
  }

/**
 * Formula to get samples
 *
 *  stratifiedSampleGroup[i] = userNoOfData/totalData * catgroup[i]
 *
 * */





