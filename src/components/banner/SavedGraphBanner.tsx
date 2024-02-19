import { FC } from "react";
import Banner from ".";

const SavedGraphBanner: FC = () => {
    return (
        <>
            <Banner>
                <p className="text-xs leading-6 text-gray-900">
                    <strong className="font-semibold">Auto Save</strong>
                    <svg
                        viewBox="0 0 2 2"
                        className="mx-2 inline h-0.5 w-0.5 fill-current"
                        aria-hidden="true"
                    >
                        <circle cx={1} cy={1} r={1} />
                    </svg>
                    Your graph is automatically saved
                </p>
            </Banner>
        </>
    )
}

export default SavedGraphBanner;