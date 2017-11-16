
#
#
#
#bron:http://koaning.io/fun-datasets.html

import csv
import json

#def CSV2JSON(string)
string = "NL"
	
csvString = string + ".csv"
jsonString = string + ".json"
csvFile = open(csvString, 'r')
jsonFile = open(jsonString, 'w')

reader = csv.reader(csvFile)
header = []
tempDict = []

for row in reader:
	if header == []:
		for key in row:
			key2 = "" + key
			header.append(key)
	else:
		emptyDict = {}
		for i in range(len(header)):
			headeri =  "" + header[i] 
			emptyDict[headeri] = row[i]
		tempDict.append(emptyDict)
json.dump(tempDict, jsonFile)
#return jsonFile