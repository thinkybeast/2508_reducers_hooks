import z from "zod";
import Loading from "./BookLoading";
import BookError from "./BookError";
import useFetch from "@/hooks/useFetch";

export const bookSchema = z.object({
  data: z.array(
    z.object({
      title: z.string(),
      author: z.string(),
    })
  ),
});

export type BookResponse = z.infer<typeof bookSchema>;

const Book = () => {
  const [{ data: bookResponse, isLoading, error }, fetchData] =
    useFetch<BookResponse>(
      "https://fakerapi.it/api/v2/books?_quantity=1",
      bookSchema
    );

  const book = bookResponse?.data[0];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <BookError onRetry={fetchData} />;
  }

  return book ? (
    <>
      <article>
        <h2>
          Enjoy reading <strong>{book.title}</strong>
        </h2>
        <p>Written by {book.author}</p>
      </article>
      <button onClick={fetchData}>
        Not interesting enough. Give me another!
      </button>
    </>
  ) : null;
};

export default Book;
