import { Button, Divider } from "@heroui/react";

export default function NotFoundPage() {
  return (
    <div className="page-wrapper text-center">
      <h1 className="text-7xl font-extrabold text-red-600">404</h1>

      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>

      <p className="text-gray-600 mt-2 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <Divider className="w-1/2 my-8" />

      <Button
        size="lg"
        className="rounded-xl px-10 text-white"
        style={{ backgroundColor: "#DD0303" }}
        onPress={() => (window.location.href = "/")}
      >
        Go to Home
      </Button>
    </div>
  );
}
