import clsx from "clsx";
import { FC } from "react";

interface BannerProps {
  children: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
}

const Banner: FC<BannerProps> = ({
  children,
  position = "top",
  className,
}) => {
  return (
    <>
      <div className={clsx("absolute bg-gray-50/25 backdrop-blur-sm z-50 flex w-full items-center gap-x-6 overflow-hidden px-6 py-1.5 sm:px-3.5 sm:before:flex-1",
        className,
        position === "top" ? "top-0" : "bottom-0"
      )}>
        {/* Backgrounds */}
        {/* <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
        >
        <div
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#b1f1ff] to-[#006aff] opacity-30"
        style={{
          clipPath:
          "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
        }}
        />
        </div>
        <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
        >
        <div
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#a2c3ff] to-[#0c72ff] opacity-30"
        style={{
          clipPath:
          "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
        }}
        />
      </div> */}

        {/* Text */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {children}
        </div>
        <div className="flex flex-1 justify-end"></div>
      </div>
    </>
  );
};

export default Banner;

/**
 *  <p className="text-xs leading-6 text-gray-900">
            <strong className="font-semibold">Unlimited Searches</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            Register now for free, unlimited graph lookups
          </p>
          <a
            className="flex-none cursor-pointer rounded-full bg-gray-900 px-3.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            onClick={() => setIsLoginDialogOpen(true)}
          >
            Sign In / Up <span aria-hidden="true">&rarr;</span>
          </a>
 */
