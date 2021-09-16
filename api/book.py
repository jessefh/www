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
        book_title = currently_reading.find_all("a", class_="bookTitle")[0]
        book_author = currently_reading.find_all("a", class_="authorName")[0]
        current_book = {
            "book": book_title,
            "author": book_author,
        }
        print(current_book)

        current_book_string = f"{book_title} by {book_author}"
        output_data = current_book_string.encode("utf-8")

        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.send_header("Content-Length", str(len(output_data)))
        self.end_headers()

        self.wfile.write(output_data)
        return

