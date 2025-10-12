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
    window.scrollTo({ top: 0, behavior: "smooth" });
    setParam("page", page);
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
              onClick={() => goToPage(idx + 1)}
              isActive={currentPage === idx + 1}
            >
              {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && goToPage(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
