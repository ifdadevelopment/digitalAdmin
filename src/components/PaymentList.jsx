import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSuccessfulPayments,
  selectAllPayments,
  selectAllPaymentsCount,
  selectAllPaymentsStatus,
  selectAllPaymentsError,
} from "../store/paymentSlice";

const PaymentList = () => {
  const dispatch = useDispatch();

  const payments = useSelector(selectAllPayments);
  const totalCount = useSelector(selectAllPaymentsCount);
  const status = useSelector(selectAllPaymentsStatus);
  const error = useSelector(selectAllPaymentsError);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(getAllSuccessfulPayments());
  }, [dispatch]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedData = payments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (status === "loading") {
    return <div className="p-4">Loading payments...</div>;
  }

  if (status === "failed") {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Payment List</h2>

      {paginatedData.length === 0 ? (
        <div>No payments found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Sl No</th>
                  <th className="p-2 border">User Name</th>
                  <th className="p-2 border">Course Image</th>
                  <th className="p-2 border">Course Title</th>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Amount (₹)</th>
                  <th className="p-2 border">Payment Method</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-2 border">{payment.userName}</td>
                    <td className="p-2 border">
                      <img
                        src={payment.courseImage}
                        alt="course"
                        className="h-10 w-16 object-cover"
                      />
                    </td>
                    <td className="p-2 border">{payment.courseTitle}</td>
                    <td className="p-2 border">{payment.orderId}</td>
                    <td className="p-2 border">₹{payment.amount}</td>
                    <td className="p-2 border">{payment.method}</td>
                    <td className="p-2 border">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentList;
