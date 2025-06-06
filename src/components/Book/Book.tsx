import z from "zod";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import useFetch from "@/hooks/useFetch";

const bookSchema = z.object({
  data: z.array(
    z.object({
      title: z.string(),
      author: z.string(),
    })
  ),
});

type BookResponse = z.infer<typeof bookSchema>;

const User = () => {
  const [{ data: bookResponse, isLoading, error }, fetchData] =
    useFetch<BookResponse>(
      "https://fakerapi.it/api/v2/books?_quantity=1",
      bookSchema
    );

  const book = bookResponse?.data[0];

  if (isLoading) {
    return <Loading>📚 Finding the most interesting of books...</Loading>;
  }

  if (error) {
    return (
      <Error onRetry={fetchData}>
        We seem to have some trouble finding a good book at the moment.
      </Error>
    );
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

export default User;
