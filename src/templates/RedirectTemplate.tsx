import { FC } from "react";

interface RedirectTemplateProps {
    title: string;
}

const RedirectTemplate: FC<RedirectTemplateProps> = ({
    title
}) => {
    return (
        // Animation of three dots to show that the page is loading
        < div className="absolute bg-white z-50 isolate flex flex-col justify-center items-center h-screen w-screen" >
            <h1 className="text-2xl text-blue-500 font-bold mb-4">
                {title}
            </h1>
            <div className="animate-pulse">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
            </div>
        </div >
    )
}

export default RedirectTemplate;