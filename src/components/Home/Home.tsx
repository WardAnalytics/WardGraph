import { FC } from "react";
import Searchbar from "./components/Searchbar";
import logo from "../../assets/ward-logo-blue-full.svg";
import Footer from "./components/Footer";

const Home: FC = () => {
    return <>
        <div className="flex items-center justify-center h-screen bg-main bg-cover bg-center bg-no-repeat">
            {/* This div gives a 50% opacity to the background image*/}
            <div className="absolute inset-0 w-full h-full bg-white bg-opacity-50"></div>
            <div className="absolute flex flex-col gap-y-10 items-center justify-center ">
                <img src={logo} alt="Ward Logo" className="w-3/4 sm:w-1/3 mx-auto" />
                <Searchbar />
            </div>
        </div>
        <Footer />
    </>
}

export default Home;