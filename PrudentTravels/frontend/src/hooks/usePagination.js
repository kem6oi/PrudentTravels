import { useState, useMemo } from 'react';

/**
 * Custom hook for pagination
 * @param {Array} data - The array of data to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 10)
 * @returns {Object} - Pagination state and methods
 */
export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Go to next page
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Go to previous page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Go to specific page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // Reset to first page
  const resetPage = () => {
    setCurrentPage(1);
  };

  // Check if there's a next page
  const hasNextPage = currentPage < totalPages;

  // Check if there's a previous page
  const hasPrevPage = currentPage > 1;

  // Get page range for pagination UI
  const getPageRange = (maxVisible = 5) => {
    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the start
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisible);
    }

    // Adjust if we're near the end
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return {
    currentPage,
    currentData,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
    getPageRange,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
    totalItems: data.length,
  };
};

export default usePagination;
