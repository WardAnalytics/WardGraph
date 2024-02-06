import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firestore from "../services/firebase/firestore";

const RedirectShortUrl: FC = () => {
  const { key } = useParams();

  const navigate = useNavigate();

  async function getFullUrl() {
    let fullUrl = null;
    if (key) {
      fullUrl = await firestore.getOriginalUrl(key);
    } else {
      console.error("Invalid url");
    }

    return fullUrl;
  }

  useEffect(() => {
    getFullUrl().then((fullUrl) => {
      if (fullUrl) {
        window.location.href = fullUrl;
      } else {
        navigate("/");
        console.error("Invalid url");
      }
    });
  }, [key]);

  return (
    // Animation of three dots to show that the page is loading
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold text-blue-500">
        Redirecting to the graph...
      </h1>
      <div className="animate-pulse">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default RedirectShortUrl;
