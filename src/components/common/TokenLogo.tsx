import { FC, useState } from "react";

const getTokenLogoURL = (token: string): string => {
    return `https://wardicons.blob.core.windows.net/token-icons/${token}.png`;
}

interface TokenLogoProps {
    token: string;
    className?: string;
}

const TokenLogo: FC<TokenLogoProps> = ({ token, className }) => {
    const logoURL = getTokenLogoURL(token);
    const [imageError, setImageError] = useState<boolean>(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageError(false);
    };

    return (
        <>
            {imageError ? null : (
                <img
                    src={logoURL}
                    alt={token}
                    className={className}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                />
            )}
        </>
    );
};

export default TokenLogo;
