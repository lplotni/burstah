require 'rubygems'
require 'sinatra'
require 'haml'
require 'csv'

$KCODE = 'u' if RUBY_VERSION < '1.9'

@@ACTIVITY = :Sleeping
@@STATUS = :Success
@@BUILD_NUM = 1
@@BUILD_TIME = DateTime.now.to_s


#set :port, 80

helpers do
  def protected!
    return if authorized?
    headers['WWW-Authenticate'] = 'Basic realm="Restricted Area. Go away or provide a password. Now."'
    halt 401, "Not authorized\n"
  end

  def authorized?
    @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? and @auth.basic? and @auth.credentials and @auth.credentials == ['dev', 'rosebud']
  end

  def is_building()
    @@ACTIVITY != :Sleeping
  end
end

get '/' do
  redirect "/control"
end

get '/control' do
  haml :control
end

post '/control/build' do
  @@ACTIVITY = :Building
  @@BUILD_NUM += 1
  @@BUILD_TIME = Time.now.iso8601
  redirect "/control"
end

post '/control/success' do
  @@STATUS = :Success
  @@ACTIVITY = :Sleeping
  redirect "/control"
end

post '/control/failure' do
  @@STATUS = :Failure
  @@ACTIVITY = :Sleeping
  redirect "/control"
end

get '/go/cctray.xml' do
  content_type :xml
  haml :cctray
end

get '/cctray.xml' do
  content_type :xml
  haml :cctray
end

get '/protected/cctray.xml' do
  protected!
  content_type :xml
  haml :cctray
end

get '/weird/cctray.xml' do
  halt 500, 'oops!'
end

get '/weird/cc.xml' do
  sleep 2
  redirect "/cctray.xml"
end

get '/dashboard/build/detail/connectfour' do
  haml :project
end

get '/go/properties/:pipeline/:buildNumber/:stage/1/:job/cruise_job_duration' do
  content_type 'application/csv'
  attachment "buildProperties.csv"
  csv_string = CSV.generate do |csv|
    csv << ["cruise_job_duration"]
    csv << ["100"]
  end
end


__END__

@@ control
!!! 5
%html
  %h1 Fake CI Server
  %table
    %tr
      %td Activitiy:
      %td= @@ACTIVITY
    %tr
      %td Status:
      %td= @@STATUS
    %tr
      %td Build number:
      %td= @@BUILD_NUM
    %tr
      %td Build time:
      %td= @@BUILD_TIME
  %p
  %form{:name => "input", :action => "control/build", :method => "post"}
    %input{:type => "submit", :value => "Start build", :disabled => is_building() }
  %form{:name => "input", :action => "control/success", :method => "post"}
    %input{:type => "submit", :value => "Success", :disabled => !is_building() }
  %form{:name => "input", :action => "control/failure", :method => "post"}
    %input{:type => "submit", :value => "Failure", :disabled => !is_building() }


@@ cctray
!!! XML
%Projects
  %Project{:name => 'pipeline1 :: stage :: job1', :webUrl => 'http://localhost:4567/dashboard/build/detail/other-project',
    :activity => :Sleeping, :lastBuildStatus => :Success,
    :lastBuildLabel => "build.1234", :lastBuildTime => "2007-07-18T18:44:48"}
  %Project{:name => 'pipeline1 :: stage :: job2', :webUrl => 'http://localhost:4567/dashboard/build/detail/connectfour',
    :activity => @@ACTIVITY, :lastBuildStatus => @@STATUS,
    :lastBuildLabel => "build.#{@@BUILD_NUM}", :lastBuildTime => @@BUILD_TIME}
  %Project{:name => 'pipeline1 :: stage :: job3', :webUrl => 'http://localhost:4567/dashboard/build/detail/dummy',
    :activity => :Sleeping, :lastBuildStatus => :Failure,
    :lastBuildLabel => "build.99", :lastBuildTime => "2007-07-18T18:44:48"}
  %Project{:name => 'pipeline2 :: stage :: job1', :webUrl => 'http://localhost:4567/dashboard/build/detail/other-project',
    :activity => :Sleeping, :lastBuildStatus => :Success,
    :lastBuildLabel => "build.1234", :lastBuildTime => "2007-07-18T18:44:48"}
  %Project{:name => 'pipeline2 :: stage :: job2', :webUrl => 'http://localhost:4567/dashboard/build/detail/connectfour',
    :activity => @@ACTIVITY, :lastBuildStatus => @@STATUS,
    :lastBuildLabel => "build.#{@@BUILD_NUM}", :lastBuildTime => @@BUILD_TIME}
  %Project{:name => 'pipeline2 :: stage :: job3', :webUrl => 'http://localhost:4567/dashboard/build/detail/dummy',
    :activity => :Sleeping, :lastBuildStatus => :Failure,
    :lastBuildLabel => "build.99", :lastBuildTime => "2007-07-18T18:44:48"}


@@ project
!!! 5
%html
  %h1 Connect Four
  %p This is the project page on the build server.
