api-tests
=========

Benchmarks for the API Backends

To run the tests you need gnuplot, awk, ab.  Whichever service you are testing needs to be running (see Docker#Run below)

```
cd analysis
./test.sh express 8082
./test.sh hapi 8083
./test.sh restify 8084
```

After each run ./timeseries.png will be generated/updated along with a number of log and summary files in the CWD

To clear this out `rm .plot.data-*`

== Docker ==

# Build

docker build -t ecfs-api-test .

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
