import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import firestore from "../firebase/firestore";
import LoadingPage from "./LoadingPage";

const RedirectShortUrl: FC = () => {
    const { key } = useParams()

    const navigate = useNavigate();

    async function getFullUrl() {
        let fullUrl = null
        if (key) {
            fullUrl = await firestore.getOriginalUrl(key)
        } else {
            console.error("Invalid url")
        }

        return fullUrl
    }

    useEffect(() => {
        getFullUrl().then(fullUrl => {
            if (fullUrl) {
                window.location.href = fullUrl
            } else {
                navigate('/')
                console.error("Invalid url")
            }
        })
    }, [key,])

    return (
        <LoadingPage title="Redirecting to the graph..." />
    )
}

export default RedirectShortUrl;