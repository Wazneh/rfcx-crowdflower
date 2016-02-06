#!/usr/bin/env bash

export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

export GUARDIAN_ID=$1;
export ROW_COUNT=$2;

export OUT_FILE="$SCRIPT_DIR/_guardian_$GUARDIAN_ID.csv";

rm -rf $SCRIPT_DIR/*.csv;

$SCRIPT_DIR/cf_grp.sh 1 $GUARDIAN_ID $ROW_COUNT;

echo "guid,audio,spectrogram,begins_at,duration,site_id,guardian_id,check_in_id,size,measured_at" > $OUT_FILE;

cat $SCRIPT_DIR/_cf_1.csv >> $OUT_FILE;

rm -rf $SCRIPT_DIR/_cf_*.csv;

echo "Crowdflower row export file (csv) created: '$OUT_FILE'";
