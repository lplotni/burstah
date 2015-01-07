#burstah [![Build Status](https://snap-ci.com/lplotni/burstah/branch/master/build_image)](https://snap-ci.com/lplotni/burstah/branch/master)
```
 _______  __   __  ______    _______  _______  _______  __   __
|  _    ||  | |  ||    _ |  |       ||       ||   _   ||  | |  |
| |_|   ||  | |  ||   | ||  |  _____||_     _||  |_|  ||  |_|  |
|       ||  |_|  ||   |_||_ | |_____   |   |  |       ||       |
|  _   | |       ||    __  ||_____  |  |   |  |       ||       |
| |_|   ||       ||   |  | | _____| |  |   |  |   _   ||   _   |
|_______||_______||___|  |_||_______|  |___|  |__| |__||__| |__|
```

**burstah** is a build monitor for [Go.CD](http://go.cd) based on [node.js](http://nodejs.org).
It is a refreshed implementation of [cidar](https://github.com/patforna/cidar).

![Burstah screenshot](/burstah_in_action.png?raw=true "Burstah in action")

###To run is just do following:

```
   git clone https://github.com/lplotni/burstah.git
   cd burstah
   sudo gem install compass
   npm install
   nohup npm start &
```
###To configure
Open config.js and add the url of your GO server as well as the stages you would
like to show. The stucture of the config.js is pretty straight-forrward:

```
var config = {
    hostname: '127.0.0.1', //IP or host the Go server is running on
    port: '8153',
    auth: '', //user:password if Go is using simple auth
    limitTo: [ 'pipeline_name :: stage_name :: job_name', 'bbb :: zzz :: aaa' ] //array with all the stages you would like to show, if empty everything will be shown
    }
  };
```
###To improve
If you're used to node.js and express.js than you should be able to quickly navigate, through the code. For testing, I use [jasmine-node](https://github.com/mhevery/jasmine-node). All the tests can be found in the spec folder. To run them just enter
```
jasmine-node spec/
```

If you want to work with Go APIs, you find the needed documentation here: [Go API docs](http://www.thoughtworks.com/products/docs/go/current/help/go_api.html)

####Fake Go.Cd Server
If you want to work on new features without running or communitcating with a real Go instance, you can just start the fake Go which can be found in the *fakeGo* directory. Just run `ruby server.rb` and this will start a simple sinatra-based app which offers the cctray.xml and is accessible via http://localhost:4567
