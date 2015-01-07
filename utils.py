# No shebang line, please run in Linux shell % python img_count.py

#Python libs
import threading, urllib2, re
import Queue, json
from xml.etree import ElementTree as etree

#Global lists
JSON_LIST = list()
URLS = list()
MOVIES = list()


class MovieSearch(object):
    def __init__(self):
        self.data = self.get_data()

    def get_movies(self):
        url = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=<APIKEY>"
        response = urllib2.urlopen(url)
        data = json.loads(response.read())
        return data

    def get_imgs(self, html):
        total = 0
        # This next line is not ideal. Would much rather use a lib such as Beautiful Soup for this
        total += len(re.findall(r"<img[^>]*>", html))
        return total

    def read_url(self, url, queue):
        data = urllib2.urlopen(url).read()
        queue.put(data)

    def fetch_urls(self):
        result = Queue.Queue()
        threads = [threading.Thread(target=self.read_url, args=(url, result)) for url in URLS]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        return result

    def get_data(self):
        print 'running'
        movies = self.get_movies()
        for movie in movies["movies"]:
            url = "http://www.imdb.com/title/tt" + movie['alternate_ids']['imdb']
            URLS.append(url)
        # queue = fetch_urls()
        while movies["movies"]:
            movie = movies["movies"].pop()
            MOVIES.append(movie)
        return MOVIES


class NprFeed(object):
    """
    Server class used to parse
    RSS feed and build dictionary
    """

    def __init__(self):
        #initialization method used to create instance vars
        self.items = self.fetch_item()
        self.entry_list = self.loop_items(self.items)

    def return_list(self):
        #method simply returns instace var
        return self.entry_list

    #methods for calculating video bit rate/compression, useful for predetermineing mememory needs
    def __calculate_bit_rate(self, dict_item):
        bit_rate = int(dict_item["fileSize"]) / int(dict_item["duration"])
        return bit_rate

    def __calculate_video_compression(self, dict_item):
        uncompressed = int(dict_item["width"]) * int(dict_item["height"]) * int(dict_item["duration"])
        video_compression = float(uncompressed) / float(dict_item["fileSize"])
        return video_compression

    def fetch_item(self):
        #Data Layer for fetching RSS feed
        wd_xml = urllib2.urlopen('http://api.npr.org/query?id=1007&apiKey=<APIKEY>')
        #convert to string:
        xml_data = wd_xml.read()
        wd_xml.close()
        #entire feed
        xml_root = etree.fromstring(xml_data)
        #find all items
        stories = []
        for story in xml_root.findall('list/story'):
            thumbnails = story.find('thumbnail')
            if thumbnails:
                stories.append([story, thumbnails])
        return stories

    def loop_items(self, item):
        #method used to loop over items, create dict and append to list
        entries = list()
        while item:
            entry = item.pop()
            xml_feed_dict = dict()
            for key in list(entry[0]):
                xml_feed_dict[key.tag] = key.text
            xml_feed_dict["thumbnail"] = entry[1][0].text
            entries.append(xml_feed_dict)
        return entries
