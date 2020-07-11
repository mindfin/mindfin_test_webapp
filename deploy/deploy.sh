#!/bin/bash



set -e

eval $(ssh-agent -s)
echo "$PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null

# ** Alternative approach
# echo -e "$PRIVATE_KEY" > /root/.ssh/id_rsa
# chmod 600 /root/.ssh/id_rsa
# ** End of alternative approach
chmod a+x ./deploy/disableHostKeyChecking.sh

./deploy/disableHostKeyChecking.sh


DEPLOY_SERVERS=$DEPLOY_SERVERS


ALL_SERVERS=(${DEPLOY_SERVERS//,/ })
echo "ALL_SERVERS ${ALL_SERVERS}"


for server in "${ALL_SERVERS[@]}"
do
echo "deploying to ${server}"

ssh mindfinadmin@${server} 'bash -s' < ./deploy/updateAndRestart.sh

done


