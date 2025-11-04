import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

export default function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <>
      {/* Desktop */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center w-1/2 bg-white border rounded-full overflow-hidden"
      >
        <Input
          placeholder="Tìm theo tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none focus-visible:ring-0 px-4 py-2 text-sm"
        />
        <Button
          type="submit"
          className="bg-blue-600 rounded-none rounded-r-full px-4 hover:bg-blue-700"
        >
          <Search className="h-4 w-4 text-white" />
        </Button>
      </form>

      {/* Mobile */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4 text-gray-700 hover:text-blue-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="p-4">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full bg-white border rounded-full overflow-hidden"
            >
              <Input
                placeholder="Tìm theo tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none focus-visible:ring-0 px-4 py-2 text-sm"
              />
              <Button
                type="submit"
                className="bg-blue-600 rounded-none rounded-r-full px-4 hover:bg-blue-700"
              >
                <Search className="h-4 w-4 text-white" />
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
