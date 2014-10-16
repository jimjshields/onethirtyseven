import datetime
import csv
import json

# asking for filepath, creating the file name

def movieFilter(movie):

    filename = 'interactive/static/interactive/dailyBoxOfficeData_full.csv'

    ofile  = open(filename, 'rU')
    reader = csv.reader(ofile)
    movieList = []

    for row in reader:
        if row[3] == movie:
            movieList.append('"date": "' + row[0] + '", ' + '"gross": ' + row[6])

    ofile.close()

    interm_data = []

    for i in movieList:
        interm_data.append('{' + i + '}, ')

    json_data = '['

    for i in interm_data:
        json_data += i

    json_data += ']'

    return json_data

def movieFilter2(movie):

    filename = 'interactive/static/interactive/dailyBoxOfficeData_full.csv' # /Users/jimshields/Documents/Blog/onethirtyseven/interactive/static/interactive/dailyBoxOfficeData_full.csv

    ofile  = open(filename, 'rU')
    reader = csv.reader(ofile)
    movieList = []

    for row in reader:
        if row[3] == movie:
            movieList.append('"date": "' + row[0] + '", ' 
                            # + '"rank": "' + row[1] + '", ' 
                            # + '"yesterday_rank": "' + row[2] + '", ' 
                            + '"movie": "' + row[3] + '", ' 
                            + '"distributor": "' + row[4] + '", ' 
                            + '"genre": "' + row[5] + '", ' 
                            + '"gross": ' + row[6] + ', ' 
                            # + '"change": "' + row[7] + '", ' 
                            + '"theaters": ' + row[8] + ', ' 
                            # + '"per_theater": ' + row[9] + ', '
                            + '"total_gross": ' + row[10] + ', '
                            + '"days": ' + row[11] + ', '
                            + '"movie_tag": "' + row[12] + '"' 
                            )
            movie_tag = row[12]

    ofile.close()

    # print movieList

    interm_data = []

    for i in movieList:
        interm_data.append('{' + i + '}, ')

    json_data = '['

    for i in interm_data:
        json_data += i

    json_data += ']'

    return json_data, movie_tag

def multipleMovieFilter(movies):
    json_data = '['
    movie_tags = []
    for i in movies:
        json_data += movieFilter2(i)[0].replace('[', '').replace(']', '')
        movie_tags.append(movieFilter2(i)[1])
    json_data += ']'
    return json_data, movie_tags
