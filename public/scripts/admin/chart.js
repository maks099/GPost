google.load("visualization", "1", {packages:["corechart"]});
    
     
$(function(){
    let parsedResult, results = sendings;
    let lineChart, pieChart;

    waitForElement()
    function waitForElement(){
        if(google.visualization !== undefined){
            startDraving()
        }
        else{
            setTimeout(waitForElement, 250);
        }
    }
   
    function startDraving(){
        drawLine()
        drawPie()
    }

    function drawLine(){
        const groupByDate = function(key) {
            return results.reduce(function(rv, x) {
            (rv[x[key].split('T')[0]] = rv[x[key].split('T')[0]] || []).push(x);
            return rv;
            }, {});
        };
        const groupedByDate = groupByDate('date')
        const data = [['Дата', 'Кількість']];
        for (const [key, value] of Object.entries(groupedByDate)){
            data.push([key, value.length])
        }
  
        var options = {
            legend: { position: 'none' },
        };
        lineChart = new google.visualization.LineChart(document.getElementById('lineChart'));
        lineChart.draw(google.visualization.arrayToDataTable(data), options);
    }

    function drawPie() {
        const groupBy = function(key) {
            return results.reduce(function(rv, x) {
            (rv[x[key].name] = rv[x[key].name] || []).push(x);
            return rv;
            }, {});
        };
        const groupedByCode = groupBy('department');
        const array = [['Скутер', 'Використань за день']];

        for (const [key, value] of Object.entries(groupedByCode)){
            
            array.push([key, value.length])
        };
        console.log(array)
        var data = google.visualization.arrayToDataTable(array);

        var options = {
            pieHole: 0.4,
            'chartArea': {'width': '100%', 'height': '100%'},
        };

        pieChart = new google.visualization.PieChart(document.getElementById('pieChart'));
        pieChart.draw(data, options);
    }

    $(document).on("change", "input[name='dateInterval']", function () {
        results = [];
        let checked = $("input[name='dateInterval']:checked").val()
        console.log(checked)
        let startDate = new Date();
        switch(checked) {
            case 'week': {
                startDate.setDate(startDate.getDate() - 7);
                break;
            }
            case 'month': {
                startDate.setDate(startDate.getDate() - 30);
                break;
            }
            case 'cwartal': {
                startDate.setDate(startDate.getDate() - 90);
                break;
            }
            case 'year': {
                startDate.setDate(startDate.getDate() - 365);
                break;
            }
            case 'all': {
                startDate.setDate(startDate.getDate() - 365 * 100);
                break;
            }
        }
     
        
        console.log(startDate.toString("MM-dd-yyyy"))
        sendings.forEach(x => {
            const d1 = new Date(startDate.toString());
            const d2 = new Date(x.date);
         
              if(d2 > d1){
                results.push(x)
              }


          
        })
        count = results.length;
       
        startDraving();
    });



    $('#btnSaveStatistic').on('click', e => {
        $.ajax({
            type: "POST",
            url: '/generateStatistic',
            data: {
                'lineChart': lineChart.getImageURI(),
                'pieChart': pieChart.getImageURI(),
                'count': sendings.length
            },
            success: function(response){
                window.open(response.path, '_blank');
            },
          
        }); 
    })

})