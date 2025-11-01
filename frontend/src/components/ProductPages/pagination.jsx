import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function PaginationSection({ totalPages }) {
  const { searchParams, setParam } = useQueryParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setParam("page", page);
  };

  return (
    <Pagination className="mt-8 flex justify-center">
      <PaginationContent className="flex items-center gap-1">
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(currentPage - 1)}
            className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200
              ${
                currentPage <= 1
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-100 hover:border hover:border-gray-300"
              }`}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {/* Page numbers */}
        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          const isActive = currentPage === page;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => goToPage(page)}
                isActive={isActive}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "border border-gray-300 bg-white text-gray-900"
                      : "text-gray-700 hover:bg-gray-100 hover:border hover:border-gray-300 cursor-pointer"
                  }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(currentPage + 1)}
            className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200
              ${
                currentPage >= totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-100 hover:border hover:border-gray-300"
              }`}
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
