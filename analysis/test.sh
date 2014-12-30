#!/bin/bash
concurrencies='200 500';
server=$1
port=$2

if [ -z "$server" ]; then
  echo "must provide server"
  echo "usage: $0 express 8082"
  exit 1;
fi

if [ -z "$port" ]; then
  echo "must provide port"
  echo "usage: $0 express 8082"
  exit 1;
fi

for c in $concurrencies; do
  echo testing $server on $port with $c concurrent users
  ab -n10000 -c$c -g $server-$c.csv http://127.0.0.1:${port}/proceedings > summary-$server-$c;
  echo "  '${server}-${c}.csv' every ::2 using 7:5 title '${server} response time (${c} concurrent)' with points, \\" > .plot.data-$server-$c
done

for i in *.csv; do
  bash renumber.sh $i > ${i}.2;
  mv ${i}.2 $i
done

cat plot.head .plot.data* plot.tail > plot
gnuplot plot
