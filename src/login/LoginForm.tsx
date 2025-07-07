import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState } from "react";

interface FormValues {
    adminName: string;
    password: string;
}

const theme = {
    background: "#1A1A2E",
    color: "#FFFFFF",
    primaryColor: "#0F3460",
};

const schema = yup.object({
    adminName: yup.string().required("adminName is required").min(4, "Minimum 4 characters"),
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Minimum 8 characters")
        .matches(/[a-z]/, "Must include a lowercase letter")
        .matches(/[A-Z]/, "Must include an uppercase letter")
        .matches(/\d/, "Must include a number")
        .matches(/[\W_]/, "Must include a special character"),
});



const LoginForm = () => {
    const navigate = useNavigate();
    const [firebaseError, setFirebaseError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    // Form submission logic
    const onSubmit = async (data: FormValues) => {
        setFirebaseError(null);

        try {
            const adminRef = collection(db, "admins");
            const q = query(
                adminRef,
                where("adminName", "==", data.adminName),
                where("password", "==", data.password)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                localStorage.setItem("isAdmin", "true");
                navigate("/dashboard");
            } else {
                setFirebaseError("Invalid admin credentials");
            }
        } catch (err:any) {
            setFirebaseError("Login failed. Please try again.");
        }
    };

    return (
        <div
            className="h-screen w-screen flex justify-center items-center font-['Poppins'] transition-all duration-200 ease-in-out"
            style={{
                background: theme.background,
                color: theme.color,
                letterSpacing: "1px",
            }}
        >
            <div className="relative" style={{ width: "22.2rem" }}>
                <div
                    className="absolute w-32 h-32 rounded-full z-10"
                    style={{
                        background: theme.primaryColor,
                        top: 0,
                        left: 0,
                        transform: "translate(-45%, -45%)",
                    }} />


                <div
                    className="relative z-10 p-8 rounded-lg"
                    style={{
                        border: "1px solid hsla(0, 0%, 65%, 0.158)",
                        boxShadow: "0 0 36px 1px rgba(0, 0, 0, 0.2)",
                        backdropFilter: "blur(20px)",
                    }}>
                    <h1 className="text-4xl text-center mb-8 opacity-60">LOGIN</h1>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            {...register("adminName")}
                            placeholder="User Name"
                            className="block w-full p-3.5 my-4 rounded-md outline-none font-medium"
                            style={{
                                color: theme.color,
                                backgroundColor: "#9191911f",
                            }}
                        />
                        {errors.adminName && (
                            <p className="text-sm text-red-400">{errors.adminName.message}</p>
                        )}

                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Password"
                            className="block w-full p-3.5 my-4 rounded-md outline-none font-medium"
                            style={{
                                color: theme.color,
                                backgroundColor: "#9191911f",
                            }}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-400">{errors.password.message}</p>
                        )}

                        {/* Firebase Error */}
                        {firebaseError && (
                            <p className="text-lg text-red-400 text-center">{firebaseError}</p>
                        )}

                        <button
                            type="submit"
                            className="block w-full p-3 mt-6 rounded-md font-bold opacity-60 transition-all duration-100 hover:scale-105"
                            style={{
                                backgroundColor: theme.primaryColor,
                                color: theme.color,
                            }}
                        >
                            SUBMIT
                        </button>
                    </form>

                    <div className="flex my-4 opacity-60">
                        <button
                            type="button"
                            className="transition-opacity duration-200 hover:opacity-80"
                            style={{ color: theme.color }}
                            onClick={() => console.log("Forgot password clicked")}
                        >
                            Forget Password
                        </button>
                    </div>
                </div>

                <div
                    className="absolute w-32 h-32 rounded-full z-11"
                    style={{
                        background: theme.primaryColor,
                        bottom: 0,
                        right: 0,
                        transform: "translate(45%, 45%)",
                    }} />
            </div>
        </div>
    );
};

export default LoginForm;
