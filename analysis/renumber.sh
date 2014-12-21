file=$1
min=$(cat $file | awk -F\\t 'NR>2 {print $2}' | sort -n | head -n1)
awk -v min=$min -F\\t 'NR==1 {print $0 "\t" "timediff"} NR>1 {print $0 "\t" ($2 - min)}' $file
