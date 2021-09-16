import json
from http.server import BaseHTTPRequestHandler

import requests
from bs4 import BeautifulSoup


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        URL = "https://www.goodreads.com/user/show/65474722-jesse"
        page = requests.get(URL)
        soup = BeautifulSoup(page.content, "html.parser")

        currently_reading = soup.find(id="currentlyReadingReviews")
        current_book = {
            "book": currently_reading.find_all("a", class_="bookTitle")[0],
            "author": currently_reading.find_all("a", class_="authorName")[0],
        }
        output_data = json.dumps(current_book, ensure_ascii=False).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Content-Length", str(len(output_data)))
        self.end_headers()

        self.wfile.write(output_data)
        return

