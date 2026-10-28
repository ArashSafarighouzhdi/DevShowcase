import Link from "next/link";
import { Star } from "lucide-react";
import type { HomeProjectType } from "@/lib/supabase/queries";

type ProjectCardProps = Pick<
  HomeProjectType[number],
  "title" | "description" | "slug" | "category" | "images"
> & {
  author: string;
  averageRating: number;
  ratingsCount: number;
  avatar: string | null;
};

const ProjectCard = ({
  title,
  description,
  author,
  avatar,
  slug,
  category,
  averageRating,
  ratingsCount,
  images,
}: ProjectCardProps) => {
  const image = images?.[0];

  return (
    <article className="group flex h-full flex-col rounded-xl border border-blue-100 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
      <Link href={`/${slug}`} className="block">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800/10">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src="/dev-showcase-icon.png"
              alt="Dev Showcase"
              className="h-28 w-28 rounded-full object-contain opacity-80"
            />
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/${slug}`} className="min-w-0">
            <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
              {title}
            </h3>
          </Link>

          {ratingsCount > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs">
              <Star size={13} className="text-primary" fill="currentColor" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-muted">({ratingsCount})</span>
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted">
          {description ?? ""}
        </p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          {category ? (
            <Link
              href={`/category/${encodeURIComponent(category)}`}
              className="inline-flex w-fit rounded-full border  border-blue-100 bo px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              {category}
            </Link>
          ) : (
            <span />
          )}

          <Link
            href={`/profile/${author}`}
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-primary"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={author}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {author.charAt(0).toUpperCase()}
              </span>
            )}

            <span>By {author}</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
