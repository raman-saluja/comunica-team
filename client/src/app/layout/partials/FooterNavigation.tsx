import { DollarSign, List, Table, User } from "react-feather";
import { useNavigate } from "react-router-dom";

function FooterNavigation() {
  const navigate = useNavigate();

  return (
    <div className="sticky md:hidden bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex flex-col items-center justify-center font-medium hover:bg-gray-50 dark:hover:bg-gray-800 group gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          <Table size={20} />
          <span className="text-xs">Play Game</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/results")}
          className="inline-flex flex-col items-center justify-center font-medium hover:bg-gray-50 dark:hover:bg-gray-800 group gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          <List size={20} />
          <span className="text-xs">Results</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/wallet")}
          className="inline-flex flex-col items-center justify-center font-medium hover:bg-gray-50 dark:hover:bg-gray-800 group gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          <DollarSign size={20} />
          <span className="text-xs">Wallet</span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="inline-flex flex-col items-center justify-center font-medium hover:bg-gray-50 dark:hover:bg-gray-800 group gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          <User size={20} />
          <span className="text-xs">My Account</span>
        </button>
      </div>
    </div>
  );
}

export default FooterNavigation;
