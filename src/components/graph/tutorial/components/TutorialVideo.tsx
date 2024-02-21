import { FC, useState } from "react";

interface TutorialVideoProps {
    src: string;
    alt: string;
}

const TutorialVideo: FC<TutorialVideoProps> = ({ src, alt }) => {
    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <div className="aspect-video w-full rounded-lg">
            <iframe
                src={src}
                title={alt}

                className={`h-full w-full rounded-lg shadow ${videoLoaded ? "block" : "hidden"}`}
                onLoad={() => setVideoLoaded(true)}
            />
        </div>
    );
}

export default TutorialVideo;