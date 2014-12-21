#!/bin/bash
concurrencies='50 200 500';
versions='restify hapi';
for v in $versions; do
  echo $v
  node ../$v/server.js &
  sleep 2
  for c in $concurrencies; do 
    ab -n10000 -c$c -g $v-$c.csv http://localhost:8080/proceedings > summary-$v-$c; 
  done
  sleep 2
  kill %1
done

for i in *.csv; do 
  bash renumber.sh $i > ${i}.2; 
  mv ${i}.2 $i
done

gnuplot plot
