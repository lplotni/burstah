var config = {
    hostname: '54.194.156.79',
    port: '8153',
    auth: '', //user:password
    project: {
      name: 'QEN',
        stages: [
        'build :: both',
        'integration-test :: backend-integration',
        'deploy-dev :: backend',
        'deploy-dev :: client',
        'smoke-test-dev :: backend',
        'functional-test :: both',
        'deploy-showcase :: backend',
        'deploy-showcase :: client',
        'smoke-test-showcase :: backend',
        'deploy-integration :: backend',
        'deploy-integration :: client',
        'smoke-test-integration :: backend'
      ]
    }
  };

exports.getConfig = function(){return config;};
