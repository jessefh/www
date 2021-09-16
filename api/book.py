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
        book_title = currently_reading.find_all("a", class_="bookTitle")[0]
        book_author = currently_reading.find_all("a", class_="authorName")[0]

        self.wfile.write(json.dumps({"book": book_title, "author": book_author}))
        return

