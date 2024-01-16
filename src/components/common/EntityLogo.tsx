import { FC, useState } from "react";

function getEntityLogoURL(entity: string): string {
  return `https://wardicons.blob.core.windows.net/icons/${entity}.png`;
}

interface EntityLogoProps {
  entity: string;
  className?: string;
}

const EntityLogo: FC<EntityLogoProps> = ({ entity, className }) => {
  const logoURL = getEntityLogoURL(entity);
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
          alt={entity}
          className={className}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
    </>
  );
};

export default EntityLogo;
