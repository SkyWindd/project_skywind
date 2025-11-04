import React, { useState } from "react";
import HeaderTop from "../components/Header/headerTop.jsx";
import HeaderBottom from "../components/Header/headerBottom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full shadow-sm border-b">
      <HeaderTop open={open} setOpen={setOpen} />
      <HeaderBottom setOpen={setOpen} />
    </header>
  );
}
