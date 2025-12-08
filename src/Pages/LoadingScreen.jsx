// import React from 'react'
// import { Spinner } from "@heroui/react";

// const LoadingScreen = () => {
//   return (
//     <div className="h-[80vh] flex items-center justify-center text-center">
//       <Spinner color="danger" label="Loading..." />
//     </div>
//   );
// }

// export default LoadingScreen






import React from 'react'
import { Spinner } from "@heroui/react";

const LoadingScreen = () => {
  return (
    <div 
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        zIndex: 9999,
        overflow: 'hidden'
      }}
      className="dark:bg-[#0f1419]"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Spinner color="danger" size="lg" />
        <p style={{ fontSize: '16px', color: '#666' }} className="dark:text-[#9aa0a6]">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen