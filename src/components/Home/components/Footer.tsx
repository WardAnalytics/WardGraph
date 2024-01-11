import { FC } from "react";
import { DiGithubBadge } from "react-icons/di";
import { FaDiscord } from "react-icons/fa";

const Footer: FC = () => {
    return <>
        <div className="flex flex-col justify-center items-center p-1">
            <div className="flex items-center justify-center bottom-0 w-full">
                {
                    /*
                    <p className="text-sm text-gray-400">Made with ❤️ by <a href="https://www.wardanalytics.net/" className="text-blue-500 hover:text-blue-600">Ward Analytics</a></p>
                    */
                }
                <a href="https://github.com/WardAnalytics/WardGraph" className="font-bold text-ward-blue p-0 mr-1"><DiGithubBadge size={28} /></a>
                <a href="https://discord.gg/4ZzgeUwa" className="font-bold text-ward-blue p-0 ml-1"><FaDiscord size={28} /></a>
            </div>
            <div className="text-sm text-ward-blue">
                <span>© 2023 Ward Analytics</span>
            </div>

        </div>
    </>
}

export default Footer