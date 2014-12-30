api-tests
=========

Benchmarks for the API Backends

To run the tests you need gnuplot, awk, ab.  Also port 8081 needs to be open.

```
cd analysis
./test.sh
```

./timeseries.png will be generated along with a number of log and summary files in the CWD

== Docker ==

# Build

docker build -t ecfs-api-test .

# Run

docker run -it --link fccdb:mysql --rm --name api-test-0 -p 8000:8081 ecfs-api-test

# Run all of them 

docker run -d --link fccdb:mysql --name api-test-express -p 8081:8081 ecfs-api-test node express/server.js
docker run -d --link fccdb:mysql --name api-test-hapi    -p 8082:8081 ecfs-api-test node hapi/server.js
docker run -d --link fccdb:mysql --name api-test-restify -p 8083:8081 ecfs-api-test node restify/server.js
