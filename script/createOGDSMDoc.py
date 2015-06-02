import os

os.popen("rm -rf ../OGDSMDoc")

os.popen("yuidoc ../js/openGDSMobile/ -t ../node_modules/yuidoc-theme-blue/ -o ../OGDSMDoc")
