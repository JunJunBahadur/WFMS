import json
import sys


f1 = open(sys.argv[1]+'c','r')
f2 = open(sys.argv[1]+'cert.txt','w')

str = f1.read()
certJ = json.loads(str)
f2.write(certJ["enrollment"]["identity"]["certificate"])
