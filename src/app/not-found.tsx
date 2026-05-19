import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <article className="prose prose-neutral dark:prose-invert">
      <h1 className="title mb-2 max-w-162.5 text-3xl font-medium">not found</h1>
      <div className="mt-8">
        <p>this page doesn&#39;t exist (yet?)</p>
        <Link href="/" className="no-underline">
          <p className="hover:underline hover:decoration-neutral-400 hover:underline-offset-4 hover:dark:decoration-neutral-600">
            back to home
          </p>
        </Link>
      </div>
    </article>
  );
}
