import { FC } from "react";
//import { useNavigate, useParams } from "react-router-dom";
//import firestore from "../services/firebase/firestore";
import RedirectTemplate from "./RedirectTemplate";

const RedirectShortUrl: FC = () => {
  // const { key } = useParams();

  // const navigate = useNavigate();

  // async function getFullUrl() {
  //   let fullUrl = null;
  //   if (key) {
  //     fullUrl = await firestore.getOriginalUrl(key);
  //   } else {
  //     console.error("Invalid url");
  //   }

  //   return fullUrl;
  // }

  return <RedirectTemplate title="Redirecting to the graph..." />;
};

export default RedirectShortUrl;
