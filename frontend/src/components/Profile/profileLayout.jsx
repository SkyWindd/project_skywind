import React from "react";
import ProfileSidebar from "./ProfileSidebar";
import { cn } from "@/lib/utils";

export default function ProfileLayout({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  children,
}) {
  return (
    <div className="min-h-[85vh] bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white shadow-sm rounded-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
        {/* Sidebar trái */}
        <ProfileSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
        />

        {/* Nội dung phải */}
        <section
          className={cn(
            "flex-1",
            "p-5 sm:p-6 md:p-10",
            "bg-gradient-to-br from-white via-gray-50 to-gray-100",
            "rounded-t-2xl md:rounded-none md:rounded-tr-2xl md:shadow-[inset_0_1px_0_#e5e7eb]",
            "transition-all duration-300 ease-out",
            "animate-fadeIn"
          )}
        >
          <div className="max-w-3xl mx-auto w-full space-y-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
