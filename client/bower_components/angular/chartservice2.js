google.load("visualization", "1", {"callback" : drawChart});
      google.charts.setOnLoadCallback(drawChart2);
      
      function drawChart2(topics, subject) {

        /*console.log(subjects);*/

        var chartData = prepareChartData(topics, subject);

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

function prepareChartData(topics, subject){
  var chartData = [];

  chartData.push(['Topic', 'Questions Count']);

  for(i=0; i<topics.length; i++)
  {
    if((subject.topics).indexOf(topics[i]._id)!=-1){
      var temp = [topics[i].name,
      parseInt(topics[i].questionsCount)
      ];
      chartData.push(temp);
    }
    
  }

  return chartData;
}
