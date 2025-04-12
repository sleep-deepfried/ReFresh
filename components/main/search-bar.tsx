import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="py-5 px-5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <FaSearch />
        </div>
        <input
          className="pl-10 pr-4 rounded-[50px] bg-[#e0e0e0] shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] w-full text-gray-400 h-10 outline-hidden focus:outline-hidden"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchBar;
