"use client"
import { useNavigate } from "react-router-dom";

const Error404Page = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate("/dashboard");
    }

    return (
        <>
            <div className="fixed inset-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(#1A1A2E, #0F3460)",
                    }}
                />

                {/* Large background circles */}
                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#2a3a85, #203075)",
                        height: "105vmax",
                        width: "105vmax",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: -4,
                    }}
                />

                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#203075, #2a3a85)",
                        height: "80vmax",
                        width: "80vmax",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: -3,
                    }}
                />

                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#2a3a85, #203075)",
                        height: "60vmax",
                        width: "60vmax",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: -2,
                    }}
                />

                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#203075, #2a3a85)",
                        height: "40vmax",
                        width: "40vmax",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: -1,
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative h-screen flex justify-center items-center text-white font-['Varela_Round',_sans-serif] text-center z-10">
                <div style={{ textShadow: "0 30px 10px rgba(0, 0, 0, 0.15)" }}>
                    <h1 className="text-[95px] m-0 font-normal">404</h1>
                    <p className="text-lg mt-0 mb-6">
                        It looks like you're lost...
                        <br />
                        That's a trouble?
                    </p>
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="px-3 py-0 border-none rounded-[20px] outline-none text-white font-normal text-base leading-[2.5] uppercase cursor-pointer font-['Nunito',_'Varela_Round',_sans-serif]"
                        style={{
                            background: "linear-gradient(#EC5DC1, #D61A6F)",
                            boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        Go To Dashboard
                    </button>
                </div>
            </div>

            {/* Floating bubbles */}
            {/* Bubble 1 */}
            <div
                className="absolute rounded-full"
                style={{
                    background: "linear-gradient(#EC5DC1, #D61A6F)",
                    boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                    top: "15vh",
                    left: "15vw",
                    height: "22vmin",
                    width: "22vmin",
                }}
            >
                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#EC5DC1, #D61A6F)",
                        boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                        width: "13vmin",
                        height: "13vmin",
                        bottom: "-25vh",
                        right: "-10vmin",
                    }}
                />
            </div>

            {/* Bubble 2 */}
            <div
                className="absolute rounded-full"
                style={{
                    background: "linear-gradient(#EC5DC1, #D61A6F)",
                    boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                    top: "20vh",
                    left: "38vw",
                    height: "10vmin",
                    width: "10vmin",
                }}
            >
                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#EC5DC1, #D61A6F)",
                        boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                        width: "5vmin",
                        height: "5vmin",
                        bottom: "-10vh",
                        left: "-8vmin",
                    }}
                />
            </div>

            {/* Bubble 3 */}
            <div
                className="absolute rounded-full"
                style={{
                    background: "linear-gradient(#EC5DC1, #D61A6F)",
                    boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                    top: "12vh",
                    right: "30vw",
                    height: "13vmin",
                    width: "13vmin",
                }}
            >
                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#EC5DC1, #D61A6F)",
                        boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                        width: "3vmin",
                        height: "3vmin",
                        bottom: "-15vh",
                        left: "-18vmin",
                        zIndex: 6,
                    }}
                />
            </div>

            {/* Bubble 4 */}
            <div
                className="absolute rounded-full"
                style={{
                    background: "linear-gradient(#EC5DC1, #D61A6F)",
                    boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                    top: "25vh",
                    right: "18vw",
                    height: "18vmin",
                    width: "18vmin",
                }}
            >
                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#EC5DC1, #D61A6F)",
                        boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                        width: "7vmin",
                        height: "7vmin",
                        bottom: "-10vmin",
                        left: "-15vmin",
                    }}
                />
            </div>

            {/* Bubble 5 */}
            <div
                className="absolute rounded-full"
                style={{
                    background: "linear-gradient(#EC5DC1, #D61A6F)",
                    boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                    top: "60vh",
                    right: "18vw",
                    height: "28vmin",
                    width: "28vmin",
                }}
            >
                <div
                    className="absolute rounded-full"
                    style={{
                        background: "linear-gradient(#EC5DC1, #D61A6F)",
                        boxShadow: "0 30px 15px rgba(0, 0, 0, 0.15)",
                        width: "10vmin",
                        height: "10vmin",
                        bottom: "5vmin",
                        left: "-25vmin",
                    }}
                />
            </div>
        </>
    )
}

export default Error404Page
