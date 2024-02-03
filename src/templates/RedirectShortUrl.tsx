import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {getOriginalUrl} from "../services/firebase/graph/short-urls";

const RedirectShortUrl: FC = () => {
    const { key } = useParams()

    const navigate = useNavigate();

    async function getFullUrl() {
        let fullUrl = null
        if (key) {
            fullUrl = await getOriginalUrl(key)
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