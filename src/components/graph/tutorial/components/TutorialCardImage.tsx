import { FC, useState } from "react";

interface TutorialImageProps {
    src: string;
    alt: string;
}

const TutorialImage: FC<TutorialImageProps> = ({ src, alt }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="aspect-video w-full rounded-lg p-1 shadow-inner">
            {!imageLoaded && (
                <div className="h-full w-full animate-pulse rounded-lg bg-gray-300 shadow"></div>
            )}
            <img
                src={src}
                alt={alt}
                className={`h-full w-full rounded-lg shadow ${imageLoaded ? "block" : "hidden"
                    }`}
                onLoad={() => setImageLoaded(true)}
            />
        </div>
    );
};

export default TutorialImage;