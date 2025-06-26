import React from "react";
import Link from "next/link";
import { Workflow } from "lucide-react";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <Link href="/admin/dashboard" className="btn btn-ghost text-xl">
        <Workflow className="w-6 h-6 mr-2" />
        DevProFlow
      </Link>
    </div>
  );
};

export default Navbar;
