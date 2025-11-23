import React from 'react'
import { Spinner } from "@heroui/react";

const LoadingScreen = () => {
  return (
    <div className="h-[80vh] flex items-center justify-center text-center">
      <Spinner color="danger" label="Loading..." />
    </div>
  );
}

export default LoadingScreen
