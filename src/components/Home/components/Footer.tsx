import { FC } from "react";
import { DiGithubBadge } from "react-icons/di";
import { FaDiscord } from "react-icons/fa";

const Footer: FC = () => {
    return <>
        <div className="absolute flex items-center justify-center h-16 bottom-0 w-full">
            {
                /*
                <p className="text-sm text-gray-400">Made with ❤️ by <a href="https://www.wardanalytics.net/" className="text-blue-500 hover:text-blue-600">Ward Analytics</a></p>
                */
            }
            <a href="https://github.com/WardAnalytics/WardGraph" className="font-bold text-ward-blue m-2"><DiGithubBadge size={40} /></a>
            <a href="https://discord.gg/4ZzgeUwa" className="font-bold text-ward-blue m-2"><FaDiscord size={40} /></a>
        </div>
    </>
}

export default Footer