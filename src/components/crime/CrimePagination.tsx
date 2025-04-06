
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CrimePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CrimePagination: React.FC<CrimePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          let pageToShow = i + 1;
          
          // Adjust for when current page is > 3
          if (currentPage > 3 && totalPages > 5) {
            if (i === 0) {
              return (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => onPageChange(1)}
                    isActive={currentPage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (i === 1 && currentPage > 3) {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              pageToShow = currentPage + i - 2;
              if (pageToShow > totalPages) return null;
            }
          }
          
          // Don't show pages beyond the total
          if (pageToShow > totalPages) return null;
          
          return (
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => onPageChange(pageToShow)}
                isActive={currentPage === pageToShow}
              >
                {pageToShow}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {totalPages > 5 && currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => onPageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CrimePagination;
