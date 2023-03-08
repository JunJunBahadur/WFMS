import os
import sys

cmd = ''
delay = 500

if(sys.argv[1] == 'start'):
    cmd = 'sudo tc qdisc replace dev lo root netem delay ' + str(delay) + 'ms'
    if(len(sys.argv)>2):
        delay = sys.argv[2]
        cmd = 'sudo tc qdisc replace dev lo root netem delay ' + str(delay) + 'ms'
elif(sys.argv[1] == 'stop'):
    cmd = 'sudo tc qdisc delete dev lo root'

os.system(cmd)