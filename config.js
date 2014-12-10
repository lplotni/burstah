var config = {
    hostname: 'Go.CD server IP or host',
    port: '8153',
    auth: '', //user:password
    ssl: false, //use SSL (for HTTPS connections)
    limitTo: [] //if empty all the jobs will be visualised (meaning everything with PIPELINE :: STAGE :: JOB name)
  };

exports.getConfig = function(){return config;};
