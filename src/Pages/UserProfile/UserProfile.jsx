import { useState, useEffect } from "react";
import { Card, CardBody, Button, Avatar } from "@heroui/react";
import { Camera } from "lucide-react";
import userImage from "../../assets/userImage.png";
import LoadingScreen from "../LoadingScreen";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log(data.user);
        setUser(data.user);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : !user ? (
    <div className="flex justify-center items-center h-screen text-red-500 ">
      User data not available
    </div>
  ) : (
    <div className="max-w-5xl mx-auto mt-16 p-6  profile">
      <h2 className="text-lg font-semibold text-[#DD0303] mb-6">Profile</h2>

      <div className="flex flex-col md:flex-row gap-10 items-start user">
        {/* Left: Photo */}
        <div>
          <img
            onError={(e) => (e.target.src = userImage)}
            className=" rounded-xl object-cover user-img"
            src={`http://localhost:3000/uploads/user/${user.image}`}
          />
        </div>

        {/* Right: Info */}
        <Card className="w-full shadow-sm p-4 bg-white user-info">
          <CardBody className="space-y-5">
            {/* First Name */}
            <div className="group">
              <p className="text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition">
                First Name
              </p>
              <p
                className="bg-gray-100 p-3 rounded-xl border border-gray-200 
                   group-hover:text-[#DD0303] group-hover:bg-blue-50 
                   transition shadow-sm"
              >
                {user.firstName}
              </p>
            </div>

            {/* Last Name */}
            <div className="group">
              <p className="text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition">
                Last Name
              </p>
              <p
                className="bg-gray-100 p-3 rounded-xl border border-gray-200
                   group-hover:text-[#DD0303] group-hover:bg-blue-50
                   transition shadow-sm"
              >
                {user.lastName}
              </p>
            </div>

            {/* Email */}
            <div className="group">
              <p className="text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition">
                Email
              </p>
              <p
                className="bg-gray-100 p-3 rounded-xl border border-gray-200
                   group-hover:text-[#DD0303] group-hover:bg-blue-50
                   transition shadow-sm break-all"
              >
                {user.email}
              </p>
            </div>

            {/* Username */}
            <div className="group">
              <p className="text-gray-500 text-sm font-semibold mb-1 group-hover:text-[#DD0303] transition">
                Username
              </p>
              <p
                className="bg-gray-100 p-3 rounded-xl border border-gray-200 
                   group-hover:text-[#DD0303] group-hover:bg-blue-50
                   transition shadow-sm"
              >
                {user.email?.split("@")[0]}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
