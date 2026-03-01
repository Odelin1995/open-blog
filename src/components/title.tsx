import { formatDate, slugify } from "@/lib/utils";

interface TitleProps {
  title: string;
  date: string;
}

export default function Title(props: TitleProps) {
  const { title, date } = props;

  return (
    <>
      <h1
        style={{
          viewTransitionName: slugify(title),
        }}
        className="title mb-2 max-w-162.5 text-3xl font-semibold"
      >
        {title}
      </h1>
      <div className="mb-8 flex max-w-162.5 items-center justify-between text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(date, {
            month: "long",
          })}
        </p>
      </div>
    </>
  );
}
