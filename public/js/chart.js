var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
	debugger;
	//google.charts.load('current', {packages: ['corechart', 'bar']})
google.charts.load('current', {packages: ['corechart', 'bar','line']})

loadModuleChart();



function loadModuleChart()
{

google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {



		$.ajax({
				          method: "POST",
				          url:  '/charts/chart1',

				          contentType: false
				        }).then (function successCallback(response){
				              debugger;
								console.log(response);
		                       var ModDaysdata = new google.visualization.DataTable();
						      ModDaysdata.addColumn('string', 'Module Name');
						      ModDaysdata.addColumn('number', 'Number of Days');

						      var i=0;
						      for(i=0;i<response.length;i++)
						      {
						      	ModDaysdata.addRows([
						      		[response[i].INCModuleName,response[i].date]

						      		])
						      }


						      var options = {
						        title: 'Number of Days for each Module',
						        'width':600,
                                'height':400,
						        hAxis: {
						          title: 'Module Name',
						          
						        },
						        vAxis: {
						          title: 'Number of Days'
						        }
						      };

						      var chart = new google.visualization.ColumnChart(
						        document.getElementById('chart1'));

						      chart.draw(ModDaysdata, options);

				        });




     
    }



loadStatusChart();



function loadStatusChart() {

	google.charts.setOnLoadCallback(drawBasic);

	function drawBasic() {


		$.ajax({
			method: "POST",
			url: '/charts/chart2',

			contentType: false
		}).then(function successCallback(response) {
			debugger;
			console.log(response);
			var Statusdata = new google.visualization.DataTable();
			Statusdata.addColumn('string', 'Status');
			Statusdata.addColumn('number', 'Number of Modules');

			var i = 0;
			for (i = 0; i < response.length; i++) {
				Statusdata.addRows([
					[response[i].Stats, response[i].StatsCount]

				])
			}


			var options = {
				title: 'Status of Modules',
				'width': 600,
				'height': 400,
				hAxis: {
					title: 'Status',

				},
				vAxis: {
					title: 'Number of Modules'
				}
			};

			var chart = new google.visualization.ColumnChart(
				document.getElementById('chart2'));

			chart.draw(Statusdata, options);

		});


	}


	loadStackChart();


	function loadStackChart() {


		google.charts.setOnLoadCallback(drawBasic);


		function drawBasic() {


			$.ajax({

				method: "POST",


				url: '/charts/chart3',


				contentType: false

			}).then(function successCallback(response) {

				debugger;

				console.log(response);


				var Statusdata = new google.visualization.DataTable();


				Statusdata.addColumn('string', 'Status');

				Statusdata.addColumn('number', 'Open');

				Statusdata.addColumn('number', 'Pending');


				Statusdata.addColumn('number', 'Resolved');


				Statusdata.addColumn('number', 'Closed');

				var i = 0;

				for (i = 0; i < response.length; i++) {

					Statusdata.addRows([

						[response[i].INCModuleName, response[i].Status1, response[i].Status2, response[i].Status3, response[i].Status0]


					])

				}


				var options = {

					title: 'Module Count according to status',


					width: 600,

					height: 400,

					legend: {position: 'top', maxLines: 3},

					bar: {groupWidth: '75%'},

					isStacked: true,

					hAxis: {

						title: 'Module Name',


					},

					vAxis: {

						title: 'Total'

					}

				};


				var chart = new google.visualization.ColumnChart(
					document.getElementById('chart3'));


				chart.draw(Statusdata, options);


			});


		}

		loadlineChart();


		function loadlineChart() {


			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {


				$.ajax({

					method: "POST",

					url: '/charts/chart4',


					contentType: false

				}).then(function successCallback(response) {

					debugger;

					console.log(response);


					var linedata = new google.visualization.DataTable();

					linedata.addColumn('string', 'Days');

					linedata.addColumn('number', 'Open');

					linedata.addColumn('number', 'Pending');

					linedata.addColumn('number', 'Resolved');

					linedata.addColumn('number', 'Closed');


					var i = 0;

					for (i = 0; i < response.length; i++)






						linedata.addRows([

							[response[i].Dates, response[i].Status1, response[i].Status2, response[i].Status3, response[i].Status0]


						]);


					var options = {


						title: 'Status per Day',


						width: 600,

						height: 400,


					};


					var chart = new google.charts.Line(document.getElementById('chart4'));


					chart.draw(linedata, options);

				});


			}

		}


	}

}
} 
});






