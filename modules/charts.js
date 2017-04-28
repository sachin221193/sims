var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var simsConnection = require('./simsConnection.js');




router.get('/', function (req, res){
	res.render('charts',{layout:'mainamit',username:req.session.user});
});




router.post('/chart4', function (req, res){




	simsConnection.query('select date_format(str_to_date(dist.crtdate,"%Y-%m-%d"),"%d-%m-%Y") as Dates,ifnull(stats1.Status1,0) as Status1,ifnull(stats2.Status2,0) as Status2,ifnull(stats3.Status3,0) as Status3,'

		+' ifnull(stats0.Status0,0) as Status0 from '

		+' (Select distinct crtdate from incidence) dist left join'

		+' (select crtdate,count(crtdate) as Status1 from incidence where Status=1 group by crtdate) stats1 on dist.crtdate=stats1.crtdate'

		+' left join'

		+' (select crtdate,count(crtdate) as Status2 from incidence where Status=2 group by crtdate) stats2 on dist.crtdate=stats2.crtdate'

		+' left join'

		+' (select crtdate,count(crtdate) as Status3 from incidence where Status=3 group by crtdate) stats3 on dist.crtdate=stats3.crtdate'

		+' left join'

		+' (select crtdate,count(crtdate) as Status0 from incidence where Status=0 group by crtdate) stats0 on dist.crtdate=stats0.crtdate;',function(err,rows){

		if(err)

			console.log(err);

		else{

			res.send(rows);






		}

	});

});

router.post('/chart3', function (req, res){




	simsConnection.query('select dist.INCModuleName,ifnull(stats1.Status1,0) as Status1,ifnull(stats2.Status2,0) as Status2,ifnull(stats3.Status3,0) as Status3,'

		+' ifnull(stats0.Status0,0) as Status0 from '

		+' (Select distinct INCModuleName from incidence) dist left join'

		+' (select INCModuleName,count(INCModuleName) as Status1 from incidence where Status=1 group by INCModuleName) stats1 on dist.INCModuleName=stats1.INCModuleName'

		+' left join'

		+' (select INCModuleName,count(INCModuleName) as Status2 from incidence where Status=2 group by INCModuleName) stats2 on dist.INCModuleName=stats2.INCModuleName'

		+' left join'

		+' (select INCModuleName,count(INCModuleName) as Status3 from incidence where Status=3 group by INCModuleName) stats3 on dist.INCModuleName=stats3.INCModuleName'

		+' left join'

		+' (select INCModuleName,count(INCModuleName) as Status0 from incidence where Status=0 group by INCModuleName) stats0 on dist.INCModuleName=stats0.INCModuleName;',function(err,rows){

		if(err)

			console.log(err);

		else{

			res.send(rows);




		}




	});

});
router.post('/chart2', function (req, res){
	simsConnection.query('select cl.Key1 as Stats,count(inc.Status) as StatsCount from incidence inc join codelkup cl on inc.Status=cl.KeyCode and cl.LkUpCode="INCIDENCE_STATUS" group by inc.Status;',function(err,rows){
	if(err)
	console.log(err);
	else{
	res.send(rows);
}
});
});

router.post('/chart1', function (req, res){
	simsConnection.query('SELECT INCModuleName,avg(DATEDIFF(INCFixedOn,crtdate)) as date FROM incidence group by INCModuleName;',function(err,rows){
	if(err)
	console.log(err);
	else{
	res.send(rows);
	}
	});
});



module.exports=router;