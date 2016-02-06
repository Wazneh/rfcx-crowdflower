#!/usr/bin/env bash

export SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

export GRP_ITERATION=$(($1 * 1));
export SCR_ITERATION=$(($2 * 1));

export ROW_COUNT=$4;
export GUARDIAN_ID=$3;

export ROW_OFFSET=$(($1 * $ROW_COUNT));
export BEGINS_AT=$((15000 * ($SCR_ITERATION - 1)));

mysql -uroot -e "SELECT guid, CONCAT('https://ark.rfcx.org/audio/',guid,'.m4a') AS audio, CONCAT('https://ark.rfcx.org/audio/',guid,'.png') AS spectrogram, $BEGINS_AT AS begins_at, 15000 AS duration, site_id, guardian_id, check_in_id, size, measured_at FROM rfcx_api.GuardianAudio WHERE guardian_id=$GUARDIAN_ID ORDER BY measured_at DESC LIMIT $ROW_COUNT OFFSET $ROW_OFFSET INTO OUTFILE '$SCRIPT_DIR/_cf__$SCR_ITERATION.csv' FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n';"