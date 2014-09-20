var config = {
    hostname: 'Go.CD server IP or host',
    port: '8153',
    auth: '', //user:password
    limitTo: [] //if empty all the jobs will be visualised (meaning everything with PIPELINE :: STAGE :: JOB name)
  };

exports.getConfig = function(){return config;};
