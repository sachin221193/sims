/**
 * Created by Batman on 27-Feb-17.
 */

var mySql=require('mysql');

var mySqlClient = mySql.createConnection(
    {
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'sims'
    } );

	mySqlClient.connect(function(error,res){
    if(error)
      console.error("error on connecting database :"+error.stack);
	  else
		  console.error("Database Connected");

});

module.exports=mySqlClient;
