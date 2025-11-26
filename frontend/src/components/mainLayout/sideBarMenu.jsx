import { Link } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarMenu({ open, onClose }) {
  const categories = ["Asus", "Acer", "Dell", "HP", "Lenovo", "MSI"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Nền mờ */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1], // mượt như iOS
            }}
            className="relative w-72 sm:w-80 h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white shadow-sm z-10">
              <h2 className="font-semibold text-gray-800 text-base sm:text-lg flex items-center gap-2">
                🛍️ Danh mục sản phẩm
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Nội dung */}
            <div className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-white to-gray-50">
              {categories.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={`/laptop?brand=${encodeURIComponent(item)}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 font-medium 
                      hover:bg-blue-50 hover:text-blue-600 transition-all duration-150 active:scale-[0.98]"
                  >
                    <span>{item}</span>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </Link>
                </motion.div>
              ))}

              <Separator className="my-3" />

              <Link
                to="/laptop"
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-150"
              >
                Xem tất cả
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-400 text-center py-3 border-t bg-white">
              © 2025 SkyWind
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
