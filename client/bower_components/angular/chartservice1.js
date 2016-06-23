google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart1);
      
      function drawChart1(subjects, exam) {

        /*console.log(subjects);*/

        var chartData = prepareChartData(subjects, exam);

        /*console.log(chartData);*/

/*        var data = new google.visualization.arrayToDataTable();
        data.addColumn('string', 'Subject Name');
        data.addColumn('number', 'Questions Count');
        data.addRows(chartData);*/

        

        var data = google.visualization.arrayToDataTable(chartData);

        var options = {
          title: 'Question Distribution'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }

function prepareChartData(subjects, exam){
  var chartData = [];

  chartData.push(['Subject', 'Questions Count']);

  for(i=0; i<subjects.length; i++)
  {
    if((exam.subjects).indexOf(subjects[i]._id)!=-1){
      var temp = [subjects[i].name,
      parseInt(subjects[i].questionsCount)
      ];
      chartData.push(temp);
    }
    
  }

  return chartData;
}
