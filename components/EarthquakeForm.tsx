import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_EARTHQUAKE, UPDATE_EARTHQUAKE } from "../graphql/mutations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GET_EARTHQUAKES } from "../graphql/queries";

const EarthquakeForm = ({
  earthquake,
  setSelectedModal,
  modal,
  onCompleted,
}: any) => {
  const [location, setLocation] = useState("");
  const [magnitude, setMagnitude] = useState(0);
  const [date, setDate] = useState("");
  const { refetch } = useQuery(GET_EARTHQUAKES);

  const [createEarthquake] = useMutation(CREATE_EARTHQUAKE);
  const [updateEarthquake] = useMutation(UPDATE_EARTHQUAKE);

  useEffect(() => {
    if (earthquake) {
      setLocation(earthquake.location);
      setMagnitude(earthquake.magnitude);
      setDate(earthquake.date);
    } else {
      setLocation("");
      setMagnitude(0);
      setDate("");
    }
  }, [earthquake]);

  const validateLocation = (location: string): string | null => {
    // Regular expression to match the coordinate format
    const coordinateRegex = /^-?\d{1,3}\.\d{1,15},\s?-?\d{1,3}\.\d{1,15}$/;

    if (!coordinateRegex.test(location)) {
      return "Location must be in the format 'latitude, longitude', with up to 15 decimal places and a comma to seprate it";
    }

    return null;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const locationError = validateLocation(location);
    if (locationError) {
      toast.error(locationError);
      return;
    }

    try {
      if (earthquake) {
        await updateEarthquake({
          variables: {
            id: earthquake.id,
            input: { location, magnitude, date },
          },
        });
        setLocation("");
        setMagnitude(0);
        setDate("");
        await refetch();
        toast.success("Earthquake updated successfully!");
      } else {
        await createEarthquake({
          variables: { input: { location, magnitude, date } },
        });
        setLocation("");
        setMagnitude(0);
        setDate("");
        await refetch();
        toast.success("Earthquake created successfully!");
      }
      setSelectedModal(!modal);
      onCompleted();
    } catch (error) {
      toast.error("Error submitting form!");
    }
  };

  return (
    <div
      className={`${
        !modal ? "hidden" : "flex"
      } w-screen items-center justify-center absolute top-0 bg-black/20 h-screen`}
    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-2/6 mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">
          {earthquake ? "Update Earthquake" : "Create Earthquake"}
        </h2>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium mb-2"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="(e.g. -61.694499999999900, 154.730200000000000)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="magnitude"
            className="block text-gray-700 font-medium mb-2"
          >
            Magnitude
          </label>
          <input
            type="number"
            id="magnitude"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Magnitude"
            value={magnitude}
            onChange={(e) => setMagnitude(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-gray-700 font-medium mb-2"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
        >
          {earthquake ? "Update" : "Create"} Earthquake
        </button>
        <button
          onClick={() => {
            setLocation("");
            setMagnitude(0);
            setDate("");
            setSelectedModal(!modal);
          }}
          className="w-full py-2 px-4 border-purple-600 text-purple-600 border bg-transparent mt-3 rounded-md hover:text-white hover:bg-purple-700 transition duration-200"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EarthquakeForm;