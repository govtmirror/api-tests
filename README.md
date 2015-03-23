api-tests
=========

We created benchmarks/flame graphs for differnet flavors of node RESTful API Backends to test scalability + give some insight, this is a very sparce test and connected only to a MySQL backend.

To run the tests you need gnuplot, awk, ab.  Whichever service you are testing needs to be running (see Docker#Run below)

```
cd analysis
./test.sh express 8082
./test.sh hapi 8083
./test.sh restify 8084
./test.sh restify-cluster 9084
```

After each run ./timeseries.png will be generated/updated along with a number of log and summary files in the CWD

To clear this out `rm .plot.data-*`

== Docker ==

# Build

docker build -t ecfs-api-test .

**Important** if the source changes (new release or whatever) the docker image needs to be rebuilt.
That is, the sources get packaged up in the image.

=== Locally ===

Run the docker mysql instance (fccdb:mysql), then

# Run

docker run -it --link fccdb:mysql --rm --name api-test-0 -p 8000:8081 ecfs-api-test

# Run all of them 

```
docker run -d --link fccdb:mysql --name api-test-express -p 8082:8081 ecfs-api-test node express/server.js
docker run -d --link fccdb:mysql --name api-test-hapi    -p 8083:8081 ecfs-api-test node hapi/server.js
docker run -d --link fccdb:mysql --name api-test-restify -p 8084:8081 ecfs-api-test node restify/server.js
```
=== Server ===

Since the database is on another machine, we'll sub out the linked env variables:

```
vi env-file #see env-file.sample
docker run -d --name api-test-restify --env-file=env-file -p 8084:8081 ecfs-api-test node restify/server.js
docker run -d --name api-test-hapi    --env-file=env-file -p 8083:8081 ecfs-api-test node hapi/server.js
docker run -d --name api-test-express --env-file=env-file -p 8082:8081 ecfs-api-test node express/server.js
```

=== Cluster ===

You can run the app in a cluster (if you have multiple cores/cpus) either 
locally or on the server by changing the command from 
"node express/server.js" to "node cluster/run.js express" 
and set the name and port as appropriate, probably something like this for the server:

```
docker run -d --name api-test-restify-cluster --env-file=env-file -p 9084:8081 ecfs-api-test node cluster/run.js restify
```

or locally:

```
docker run -d --link fccdb:mysql --name api-test-restify-cluster -p 9084:8081 ecfs-api-test node cluster/run.js restify
```

=== Flame Graph ===

### Run the following 4 commands in seperate window

This is for restify only but can work for the others, right now the dtrace provider
only works Mac OS X and Solaris-like systems such as Illumos or SmartOS. 

dependencies are:  

    dtrace  
    npm install dtrace-provider  
    npm install -g stackvis  

                
Start the node service  

    $ node restify/server.js  

This samples the reset service 100 samples per 60 seconds  

    $ sudo dtrace -P restify* -n 'profile-97/pid == 38703 && arg1/{ @[jstack(150, 8000)] = count(); } tick-60s { exit(0); }' > stacks.out  

run some load, normally this is better suited in an envrionment running a combination of requests  

    $ for i in {1..200} ; do curl -is http://127.0.0.1:8081/proceedings ; done  

Once the last two operations are finsihed use the stack output to generate the flame graph  

    $ sudo stackvis dtrace flamegraph-svg < stacks.out > stacks.svg  

