# This simple python script generates random garbage bin status data and throws it back out to the command line.
import sys
import random
import os
import time

def createRandomGarbageData():
    #We need: lattitude, longitude, battery and capacity.
    temperature = random.uniform(-20,40)
    latitude = random.uniform(-90,90)
    longitude = random.uniform(-180,180)
    battery = random.uniform(0,100)
    capacity = random.uniform(0,100)
    
    #We sleep for a few seconds. To an extent this emulates
    #what an actual reading is like though that is admittedly significantly faster.
    time.sleep(1)
    
    #Not sure of Justin's format, but for the time being, this should
    #suffice.
    print("%s,%s,%s,%s,%s" % (temperature, battery, capacity, latitude, longitude))

def doFileWork():
    fileName = "dummyFile.txt"
    filePath = os.path.join(os.getcwd(), fileName)
    #If the file exists, we immediately error out!
    if os.path.exists(filePath):
        raise Exception("FILE ALREADY EXISTS. CONCURRENCY FAILED.")
    try:
        with open(filePath, 'w') as ourFile:
            ourFile.write("%s" % random.randint(0,100))
            #Keep the file open for some time.
            time.sleep(2)
    except IOError:
        raise IOError("FILE ALREADY EXISTS. CONCURRENCY FAILED.")

    return filePath
    
def cleanFileWork(filePath):
    os.remove(filePath)
        
def main():
    #Parse command line and see if the file test is also required.
    args = sys.argv
    
    #We want to do the file based test. As in we will open a file, write to it and delete it.
    #If concurrency works, then the file should not exist after execution is done.
    #If the file is detected, then there is a problem.
    if len(args) > 1:
        filePath = doFileWork()
        createRandomGarbageData()
        cleanFileWork(filePath)
    else:
        #We generate random data and print it out.
        createRandomGarbageData()
    
if __name__ == '__main__':
    main()

