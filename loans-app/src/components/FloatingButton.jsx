import { FaPlus } from "react-icons/fa";

export default function FloatingButton({ onClick }) {
  return (
    <button 
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-500 text-white 
                 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
      onClick={onClick}
    >
      <FaPlus size={24} />
    </button>
  );
}