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

def movieTicketsJson():

    filename = 'onethirtyseven/static/onethirtyseven/theater_data_csv.csv' # /Users/jimshields/Documents/Blog/onethirtyseven/interactive/static/interactive/dailyBoxOfficeData_full.csv

    ofile  = open(filename, 'rU')
    reader = csv.reader(ofile)
    csv_data = []

    for row in reader:
        if row[0] == "year":
            pass
        else:
            csv_data.append('"year": ' + row[0] + ', ' 
                            + '"total_gross_adj": ' + row[1] + ', ' 
                            + '"tickets_sold_adj": ' + row[2] + ', ' 
                            + '"num_movies_adj": ' + row[3] + ', ' 
                            + '"avg_ticket_price": ' + row[4] + ', ' 
                            + '"avg_ticket_price_infl_adj": ' + row[5] + ', ' 
                            + '"avg_gross_per_movie": ' + row[6] + ', ' 
                            + '"avg_tickets_per_movie": ' + row[7] + ', ' 
                            + '"num_indoor_screens": ' + row[8] + ', ' 
                            + '"num_drivein_screens": ' + row[9] + ', ' 
                            + '"num_total_screens": ' + row[10] + ', '
                            + '"avg_gross_per_screen": ' + row[11] + ', '
                            + '"avg_tickets_per_screen": ' + row[12] + ', '
                            + '"total_gross_adj_change": ' + row[13] + ', ' 
                            + '"tickets_sold_adj_change": ' + row[14] + ', ' 
                            + '"num_movies_adj_change": ' + row[15] + ', ' 
                            + '"avg_ticket_price_change": ' + row[16] + ', ' 
                            + '"avg_ticket_price_infl_adj_change": ' + row[17] + ', ' 
                            + '"avg_gross_per_movie_change": ' + row[18] + ', ' 
                            + '"avg_tickets_per_movie_change": ' + row[19] + ', ' 
                            + '"num_indoor_screens_change": ' + row[20] + ', ' 
                            + '"num_drivein_screens_change": ' + row[21] + ', ' 
                            + '"num_total_screens_change": ' + row[22] + ', '
                            + '"avg_gross_per_screen_change": ' + row[23] + ', '
                            + '"avg_tickets_per_screen_change": ' + row[24]
                            )

    ofile.close()

    # print movieList

    interm_data = []

    for i in csv_data:
        interm_data.append('{' + i + '}, ')

    json_data = '['

    for i in interm_data:
        json_data += i

    json_data += ']'

    return json_data
