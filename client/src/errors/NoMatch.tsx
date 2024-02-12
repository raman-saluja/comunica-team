import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NoMatch() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-7xl">404</h3>
        <p className="font-bold text-gray-700 text-2xl">Not Found</p>
        <Link to="/" className="pt-5 flex items-center gap-2">
          <ChevronLeft size={15} /> Go to Home
        </Link>
      </div>
    </div>
  );
}
