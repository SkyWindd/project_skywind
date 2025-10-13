import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

export default function BreadcrumbNav() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  // Ẩn breadcrumb ở trang chủ
  if (pathnames.length === 0) return null

  return (
    <div className="w-full bg-secondary py-3 px-6">
      <Breadcrumb>
        <BreadcrumbList className="text-sm text-gray-500">
          {/* Trang chủ */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1 text-gray-800 hover:text-blue-600 font-medium">
                <Home className="w-4 h-4" />
                Trang chủ
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          {/* Các cấp đường dẫn */}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`
            const isLast = index === pathnames.length - 1

            // Chuyển đường dẫn sang dạng chữ đẹp
            const label = decodeURIComponent(name)
              .replace(/-/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase())

            return (
              <BreadcrumbItem key={routeTo}>
                {isLast ? (
                  <BreadcrumbPage className="text-gray-400">{label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link to={routeTo} className="hover:text-blue-600 text-gray-800 transition-colors">
                        {label}
                      </Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
