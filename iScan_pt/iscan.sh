#!/bin/bash

mongod='/usr/local/include/mongodb/bin/mongod'
mongoConf='/usr/local/include/mongodb/conf/mongo.conf'
nginx='/usr/sbin/nginx'
nginxConf='/etc/nginx/nginx.conf'
forever='/usr/local/node/bin/forever'
projects=(
	'/root/poiMatch/backend/app.js'
	'/root/AtlasBeaconAWS/app.js '
	'/root/AtlasBeaconAWS/blgSever/index.js '
	'/root/AtlasBeaconAWS/cron/index.js'
)

start(){
	#nginx
	$nginx -c $nginxConf
	if [ $? == 0 ]
	then 
		echo -e "nginx start success!"
 	else
        	echo -e "nginx start failed!"
    fi

	#mongodb
	$mongod -f $mongoConf
	if [ $? == 0 ]
	then 
		echo -e "mongodb start success!"
		for p in ${projects[*]}
       		do
                	$forever start $p
       		done
	else
		echo -e "mongodb start failed!"
	fi
}
stop(){
	for p in ${projects[*]}
	do
		$forever stop $p
	done
	$nginx -s stop
        $mongod -f $mongoConf --shutdown
	echo -e 'all services stoped!'
}

case $1 in
	start)
		start
	;;
	restart)
		stop
		start
	;;
	stop)
		stop
	;;
	*)
		echo 'nothing to do'
	;;
esac
