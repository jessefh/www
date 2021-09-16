import json
from http.server import BaseHTTPRequestHandler

import requests
from bs4 import BeautifulSoup


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()

        URL = "https://www.goodreads.com/user/show/65474722-jesse"
        page = requests.get(URL)
        soup = BeautifulSoup(page.content, "html.parser")

        currently_reading = soup.find(id="currentlyReadingReviews")
        data = {
            "book": currently_reading.find_all("a", class_="bookTitle")[0],
            "author": currently_reading.find_all("a", class_="authorName")[0],
        }
        json_string = json.dumps(data)

        self.wfile.write(json_string.encode(encoding="utf_8"))
        return

