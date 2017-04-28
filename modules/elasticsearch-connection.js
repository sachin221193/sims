var elasticsearch=require('elasticsearch');

var esClient = new elasticsearch.Client( {  
  host: 'localhost:9200',
  log: 'trace'
});

module.exports = esClient; 