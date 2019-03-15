#!/bin/bash

USERNAME=$1

TESTID=$(sfdx force:data:soql:query -t -q 'select id, AsyncApexJobId, StartTime, status, ClassesCompleted, ClassesEnqueued from ApexTestRunResult order by starttime desc limit 1' -u "$USERNAME" --json | jq .result.records[0].AsyncApexJobId)

sfdx force:apex:test:report -i "$TESTID" -c -d 20190312 -u stryker 

echo $TESTID