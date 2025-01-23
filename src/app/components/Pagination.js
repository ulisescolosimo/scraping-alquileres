import { Button } from "@/components/ui/button";

const Pagination = ({ nextPage, prevPage, page, totalPages }) => (
  <div className="flex justify-center gap-5 items-center mt-6">
    <Button onClick={prevPage} disabled={page === 1}>
      Previous
    </Button>
    <p className="text-center">
      Page {page} of {totalPages}
    </p>
    <Button onClick={nextPage} disabled={page === totalPages}>
      Next
    </Button>
  </div>
);

export default Pagination;
