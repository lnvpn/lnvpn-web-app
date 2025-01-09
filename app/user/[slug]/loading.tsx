import { FaSpinner } from "react-icons/fa6";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin h-6 w-6 mr-2" />
      <p>Loading...</p>
    </div>
  );
}
