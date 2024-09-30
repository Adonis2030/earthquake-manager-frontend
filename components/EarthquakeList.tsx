import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EARTHQUAKES } from "../graphql/queries";
import { DELETE_EARTHQUAKE } from "../graphql/mutations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegTrashCan } from "react-icons/fa6";
import {  IoCreateSharp } from "react-icons/io5";


const ITEMS_PER_PAGE = 15;
const MAX_PAGINATION_BUTTONS = 10;

const EarthquakeList = ({ onEdit, setSelectedModal, modal }: any) => {
  const { loading, error, data, refetch } = useQuery(GET_EARTHQUAKES);
  const [deleteEarthquake] = useMutation(DELETE_EARTHQUAKE);
  const [delayedLoading, setDelayedLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const sortedData = [...data.earthquakes].sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedData = sortedData.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );
      setPaginatedItems(paginatedData);
    }
  }, [data, currentPage]);

     useEffect(() => {
        const loadingTimeout = setTimeout(() => {
          setDelayedLoading(false);
        }, 1000);
    
        return () => clearTimeout(loadingTimeout); 
      }, [loading]);

    
  const handleDelete = async (id: any) => {
    try {
      await deleteEarthquake({ variables: { id } });
      toast.success("Item deleted successfully!");
      await refetch();
    } catch (error) {
      toast.error("Error deleting item!");
    }
  };

  const handleEdit = async (earthquake: any) => {
    onEdit(earthquake);
    await refetch();
  };

  const handleCreate = async () => {
    setSelectedModal(!modal);
    await refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading || delayedLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="flex flex-col items-center">
          <img
            src="/https___lottiefiles.com_animations_loading-Y3Pt36IpkJ.gif"
            className="h-44 w-44"
            alt="loading"
          />
          <p>Loading...</p>
        </div>
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  const totalItems = data.earthquakes.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const halfRange = Math.floor(MAX_PAGINATION_BUTTONS / 2);

    pageNumbers.push(1);

    if (currentPage > halfRange + 2) {
      pageNumbers.push("...");
    }

    const startPage = Math.max(2, currentPage - halfRange);
    const endPage = Math.min(totalPages - 1, currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - halfRange - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Earthquake Manager</h1>
        <button
          onClick={handleCreate}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
        >
          Create
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Location</th>
              <th className="text-left px-4 py-2">Magnitude</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((earthquake: any) => (
              <tr key={earthquake.id} className="border-t border-gray-300">
                <td className="px-4 py-2">{earthquake.id}</td>
                <td className="px-4 py-2">{earthquake.location}</td>
                <td className="px-4 py-2">{earthquake.magnitude}</td>
                <td className="px-4 py-2">
                  {new Date(earthquake.date).toLocaleString()}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(earthquake)}
                    className="border-[#7839CD] border text-[#7839CD] items-center font-medium gap-1 hover:text-white flex py-1 px-3 rounded hover:bg-blue-500"
                  >
                    Edit
                    <IoCreateSharp />
                    </button>
                  <button
                    onClick={() => handleDelete(earthquake.id)}
                    className="text-[#7839CD] items-center font-medium gap-1 hover:text-white flex py-1 px-3 rounded hover:bg-[#d30000]"
                  >
                    <FaRegTrashCan />

                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          className="mx-1 px-3 py-1 border bg-white text-black"
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => page !== "..." && handlePageChange(page as number)}
            className={`mx-1 px-3 py-1 border ${
              currentPage === page
                ? "bg-purple-500 text-white"
                : "bg-white text-black"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          className="mx-1 px-3 py-1 border bg-white text-black"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EarthquakeList;
