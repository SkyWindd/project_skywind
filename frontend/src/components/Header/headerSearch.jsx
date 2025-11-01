import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export default function HeaderSearch() {
  return (
    <div className="hidden md:flex items-center w-1/2 bg-white border rounded-full overflow-hidden">
      <Input
        placeholder="Tìm theo tên sản phẩm..."
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2 text-sm"
      />
      <Button className="bg-blue-600 rounded-none rounded-r-full px-4 hover:bg-blue-700">
        <Search className="h-4 w-4 text-white" />
      </Button>

      {/* Search (mobile) */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4 text-gray-700 hover:text-blue-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="p-4">
            <div className="flex items-center w-full bg-white border rounded-full overflow-hidden">
              <Input
                placeholder="Tìm theo tên sản phẩm..."
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2 text-sm"
              />
              <Button className="bg-blue-600 rounded-none rounded-r-full px-4 hover:bg-blue-700">
                <Search className="h-4 w-4 text-white" />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    
  );
}
