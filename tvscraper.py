#!/usr/bin/env python 2.7 Name: Sanne Oud Student number: 11014067
''' This script scrapes IMDB and outputs a CSV file 
with information about the highest rated tv series. ''' 
import csv 
from pattern.web import URL, DOM, plaintext
 
BACKUP_HTML = 'tvseries.html' 
OUTPUT_CSV = 'tvseries.csv' 

def extract_tvseries(dom): 
	''' Extract a list of highest rated TV series from DOM (of IMDB page). 
	Each TV series entry should contain the following fields: 
	- TV Title 
	- Rating 
	- Genres (comma separated if more than one) 
	- Actors/actresses (comma separated if more than one) 
	- Runtime (only a number!) ''' 
	# Make a list for the results.
	result = []
	
	for div_a in dom.by_tag("div.lister-item-content"):
		# Make a temporary list and a string for the actors.
		list = []
		actors = ""
		
		# Get the information.
		# Get the film name and remove unicode characters.
		for a in div_a.by_tag("a")[:1]:
			list.append(a.content.encode('utf-8'))
		# Get the rating and remove unicode characters.
		for strong in div_a.by_tag("strong")[:1]:
			list.append(strong.content.encode('utf-8'))
		# Get the genre and remove unicode characters.
		for span in div_a.by_tag("span.genre")[:1]:
			temp = plaintext(span.content)
			list.append(temp.encode('utf-8'))
		# Get the actors and remove unicode characters.
		counter = 0
		for p in div_a.by_tag("p")[2]:
			if len(p) == 1:
				if counter > 0:
					actors += plaintext(p.content).encode('utf-8'),
				else:
					counter = 1
					actors = plaintext(p.content).encode('utf-8'),
		list.append(', '.join(actors))
		# Get the runtime numbers and remove unicode characters.
		for runtime in div_a.by_tag("span.runtime")[:1]:
			runtime = plaintext(runtime.content).split(" ")
			list.append(runtime[0].encode('utf-8'))
			
		# Put the list in results so you get a list of lists
		result.append(list)
	
	return [result]	

def save_csv(f, tvseries): 
	''' Output a CSV file containing highest rated TV-series. ''' 
	# heleo
	writer = csv.writer(f) 
	writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
	for row in tvseries:
		writer.writerows(row)

		
if __name__ == '__main__': 
	
	# get the url, download the html and get the dom
	url = URL("http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series")
	html = url.download()
	dom = DOM(html)
	
	# Save a copy to disk in the current directory, this serves as an backup 
	# of the original HTML, will be used in grading. 
	with open(BACKUP_HTML, 'wb') as f: 
		f.write(html) 
 
	# Extract the tv series (using the function you implemented) 
	tvseries = extract_tvseries(dom) 
		
	# Write the CSV file to disk (including a header) 
	with open(OUTPUT_CSV, 'wb') as output_file: 
		save_csv(output_file, tvseries) 

