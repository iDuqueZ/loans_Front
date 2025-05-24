
import { FaPlus } from "react-icons/fa";

function FloatingButton({ onClick, className = "" }) {
  return (
      <button
          onClick={onClick}
          className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg 
                     text-white text-2xl flex items-center justify-center
                     transition-all duration-300 hover:scale-110 focus:outline-none
                     focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
                     ${className}`}
      >
          <span className="sr-only">Añadir préstamo</span>
          <FaPlus size={24} color="white"/>
      </button>
  );
}

export default FloatingButton;