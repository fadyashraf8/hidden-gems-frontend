import React from 'react'
import { Spinner } from "@heroui/react";

const LoadingScreen = () => {
  return (
    <div className="h-[80vh] flex items-center justify-center text-center text-[#DD0303]">
       <Spinner />
    </div>
  );
}

export default LoadingScreen
