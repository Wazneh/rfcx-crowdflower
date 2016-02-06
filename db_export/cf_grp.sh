#!/usr/bin/env bash

export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

export GRP=$1;
export OUT_FILE="$SCRIPT_DIR/_cf_$GRP.csv";
export GUARDIAN_ID=$2;
export ROW_COUNT=$3;

$SCRIPT_DIR/cf_grp_iter.sh $GRP 1 $GUARDIAN_ID $ROW_COUNT;
$SCRIPT_DIR/cf_grp_iter.sh $GRP 2 $GUARDIAN_ID $ROW_COUNT;
$SCRIPT_DIR/cf_grp_iter.sh $GRP 3 $GUARDIAN_ID $ROW_COUNT;
$SCRIPT_DIR/cf_grp_iter.sh $GRP 4 $GUARDIAN_ID $ROW_COUNT;
$SCRIPT_DIR/cf_grp_iter.sh $GRP 5 $GUARDIAN_ID $ROW_COUNT;
$SCRIPT_DIR/cf_grp_iter.sh $GRP 6 $GUARDIAN_ID $ROW_COUNT;

cat $SCRIPT_DIR/_cf__1.csv $SCRIPT_DIR/_cf__2.csv $SCRIPT_DIR/_cf__3.csv $SCRIPT_DIR/_cf__4.csv $SCRIPT_DIR/_cf__5.csv $SCRIPT_DIR/_cf__6.csv >> $OUT_FILE;

rm -rf $SCRIPT_DIR/_cf__*.csv;
