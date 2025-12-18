import React from 'react'

export default function HomeOwner() {
  const baseURL = import.meta.env.VITE_Base_URL;
    const { userInfo } = useSelector((state) => state.user || {});
  return (
    <div>
      HomeOwner
      <p>Total Visits: {gem.visitsCount}</p>
    </div>
  );
}
