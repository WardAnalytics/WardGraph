import { FC } from "react";
import clsx from "clsx";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

/** This interface is a page to display in the breadcrumbs.
 * It can then be clicked to navigate to that page.
 *
 * @param name: The name of the page
 * @param onClick: The function to call when the page is clicked
 */

export interface Page {
  name: string | any;
  onClick?: () => void;
}

/** This component is a breadcrumbs to display the current page and allow the
 * user to navigate back to previous pages
 *
 * @param pages: The pages to display
 * @param className: The class name to apply to the breadcrumbs
 */

interface BreadcrumbsProps {
  pages: Page[];
  className?: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({
  pages,
  className,
}: BreadcrumbsProps) => {
  return (
    <nav className={clsx("flex", className)} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center gap-x-4">
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex flex-row items-center">
              {
                /* Breadcrumb separator. Only show if it's not the first list item */
                pages.indexOf(page) !== 0 && (
                  <ChevronRightIcon className="animate-in fade-in  slide-in-from-left-2 -ml-2 mr-2 h-4 w-4 text-gray-400" />
                )
              }

              <a
                onClick={page.onClick}
                className={`font-small text-sm text-gray-400 hover:text-gray-600 ${
                  pages.indexOf(page) === pages.length - 1
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
              >
                {
                  /* If the page name is bigger than 20 characters and it's sm, slice it in the middle with ... and 10 chars on each side. Else, show full page name */
                  page.name.length > 20 ? (
                    <>
                      <p className="block">{page.name}</p>
                    </>
                  ) : (
                    <p className="animate-in fade-in slide-in-from-left-2">
                      {page.name}
                    </p>
                  )
                }
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
