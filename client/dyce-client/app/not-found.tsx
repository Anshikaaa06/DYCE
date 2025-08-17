import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="w-full h-screen bg-dark flex flex-col items-center justify-center space-y-6">
      <h2 className="text-white text-3xl"> Page not found</h2>
      <Link href="/" className="text-primary">
        Go back to home
      </Link>
    </div>
  );
};

export default NotFound;
