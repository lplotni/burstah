var config = {
    hostname: 'Go.CD server IP or host',
    port: '8153',
    auth: '', //user:password
    limitTo: [] //if empty all the content from the cctray.xml will be visualized
  };

exports.getConfig = function(){return config;};
