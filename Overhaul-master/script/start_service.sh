#! /bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
STR=`echo ${DIR}`
echo ${DIR}
source $DIR/docker.conf

function startService()
{
   echo "Begin to start service [$1]"
   case "$1" in
        "yudao-gateway")
                ps -ef | grep yudao-gateway.jar | grep -v grep | awk '{print $2}' | xargs kill -9
                nohup java -Xms512m -Xmx1024m -jar   ${DIR}/jars/yudao-gateway.jar  >/dev/null 2>&1 &
                ;;
       "yudao-module-system-server")
                ps -ef | grep yudao-module-system-server.jar | grep -v grep | awk '{print $2}' | xargs kill -9
                nohup java -Xms512m -Xmx1024m -jar   ${DIR}/jars/yudao-module-system-server.jar  >/dev/null 2>&1 &
                ;;
       "yudao-module-infra-server")
                ps -ef | grep yudao-module-infra-server.jar | grep -v grep | awk '{print $2}' | xargs kill -9
                nohup java -Xms512m -Xmx1024m -jar   ${DIR}/jars/yudao-module-infra-server.jar  >/dev/null 2>&1 &
                ;;
       "yudao-module-bpm-server")
            ps -ef | grep yudao-module-bpm-serverc.jar | grep -v grep | awk '{print $2}' | xargs kill -9
            nohup java -Xms512m -Xmx1024m -jar   ${DIR}/jars/yudao-module-bpm-server.jar  >/dev/null 2>&1 &
            ;;
        "all")
		serviceList=(yudao-gateway yudao-module-system-server yudao-module-infra-server yudao-module-bpm-server)
                for service in ${serviceList[@]}
                do
                  ps -ef | grep $service.jar | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
                  nohup java -Xms512m -Xmx1024m -jar  ${DIR}/jars/$service.jar  >/dev/null 2>&1 &
                  echo ${service} is started!
                done
                ;;
        *)
                echo Unsupported Options for this command!
                exit -1
                ;;
        esac
   echo Successfully start service [$1]
}

SERVICE_NAME=$1
if [ "$SERVICE_NAME" == "" ];then
    startService all
    exit -1
fi
startService $SERVICE_NAME
