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
                navigate('/')
                console.error("Invalid url")
            }
        })
    }, [])

    return (
        // Animation of three dots to show that the page is loading
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl text-blue-500 font-bold mb-4">
                Redirecting to the graph...
            </h1>
            <div className="animate-pulse">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

export default RedirectShortUrl;