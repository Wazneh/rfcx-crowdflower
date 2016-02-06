#!/usr/bin/env bash

export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

export OUT_FILE="$SCRIPT_DIR/_cf.csv";

rm -rf $SCRIPT_DIR/*.csv;

$SCRIPT_DIR/cf_grp.sh 1;
$SCRIPT_DIR/cf_grp.sh 2;

echo "guid,audio,spectrogram,begins_at,duration,site_id,guardian_id,check_in_id,size,measured_at" > $OUT_FILE;

cat $SCRIPT_DIR/_cf_1.csv $SCRIPT_DIR/_cf_2.csv >> $OUT_FILE;

rm -rf $SCRIPT_DIR/_cf_*.csv;
