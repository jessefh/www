import { NextResponse } from "next/server";
import { getCurrentlyReading } from "../../../lib/goodreads";

export const revalidate = 3600;

export async function GET() {
  const book = await getCurrentlyReading();

  return NextResponse.json({
    bookTitle: book.bookTitle,
    bookTitleUrl: book.bookTitleUrl,
    bookAuthor: book.bookAuthor,
    bookAuthorUrl: book.bookAuthorUrl,
  });
}
