# Name: Sanne Oud 
# Student number: 11014067
# Data processing
#
# This python converts a CSV into a JSON file. (CSV must be comma seperated)
# Input should be the name of the file without ".csv".

import csv
import json

def CSV2JSON():
	# Get the name
	string = "week_5csv"
	
	# Get the name of the file and create a .json version.
	csvString = string + ".csv"
	jsonString = string + ".json"
	
	# Open the csv file and a new json file.
	csvFile = open(csvString, 'r')
	jsonFile = open(jsonString, 'w')
	
	# Read the csv.
	reader = csv.reader(csvFile)
	
	# Make lists for the header and a temporary one.
	header = []
	tempDict = []
	
	# Read each row of the reader.
	for row in reader:
		# Get the header if not already there.
		if header == []:
			for key in row:
				key2 = "" + key
				header.append(key)
		# Make a dict of all the data.
		else:
			emptyDict = {}
			for i in range(len(header)):
				headeri =  "" + header[i] 
				emptyDict[headeri] = row[i]
			tempDict.append(emptyDict)
	# Json dump all the data in the json file.
	json.dump(tempDict, jsonFile)
	
	# Return the json file.
	return jsonFile

if __name__ == "__main__":
	CSV2JSON()