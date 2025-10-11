import { Link } from "react-router-dom";

export default function CategorySection({ categories }) {
  return (
      <section className="border border-gray-200 bg-white rounded-2xl p-6 shadow-sm mt-10">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-600 border-l-4 border-blue-600 pl-3">
          Danh mục sản phẩm
        </h2>
        <Link
          to="/categories"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Xem tất cả
        </Link>
      </div>

      {/* Danh sách danh mục */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to={cat.link}
            className="flex flex-col items-center justify-center p-4 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition-all bg-white"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 object-contain mb-3"
            />
            <span className="text-gray-700 font-medium text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
