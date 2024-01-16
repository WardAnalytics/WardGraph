import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firestore from "../firebase/firestore";

const RedirectShortUrl: FC = () => {
    const navigate = useNavigate();

    async function getFullUrl(shortenedUrl: string) {
        const key = shortenedUrl.split("/").pop()
        console.log(key)

        let fullUrl = null
        if (key) {
            fullUrl = await firestore.getOriginalUrl(key)
        } else {
            console.error("Invalid url")
        }

        return fullUrl
    }

    useEffect(() => {
        const shortenedUrl = window.location.href
        getFullUrl(shortenedUrl).then(fullUrl => {
            if (fullUrl) {
                window.location.href = fullUrl
            } else {
                console.error("Invalid url")
                navigate('/')
            }
        })
    }, [])

    return <div>You are being redirected to the shared graph</div>;
}

export default RedirectShortUrl;