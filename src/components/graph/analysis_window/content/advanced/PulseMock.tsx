import { FC } from "react";
interface LoadingPulseMockProps {
  size?: "sm" | "md" | "lg" | "xl";
}

// Mock Window
const LoadingPulseMock: FC<LoadingPulseMockProps> = ({
  size = "md",
}) => {
  const sizeRepetitionsMap: Record<"sm" | "md" | "lg" | "xl", number> = {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  };

  return (
    <div className="flex flex-col gap-4">
      {
        Array(sizeRepetitionsMap[size]).fill(null).map((_, index) => (
          <>
            <div
              key={index}
              className="h-7 w-1/2 animate-pulse rounded-md bg-gray-200"
            />
            <div
              key={index}
              className="h-7 w-2/3 animate-pulse rounded-md bg-gray-200"
            />
            <div
              key={index}
              className="h-7 w-4/5 animate-pulse rounded-md bg-gray-200"
            />
            <div
              key={index}
              className="h-7 w-full animate-pulse rounded-md bg-gray-200"
            />
          </>
        ))
      }

      {/*  <div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-72 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>

      <div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-72 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-72 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-56 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-24 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-72 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div>
      <div className="h-7 w-36 animate-pulse rounded-md bg-gray-200"></div> */}
    </div>
  );
};

export default LoadingPulseMock;
