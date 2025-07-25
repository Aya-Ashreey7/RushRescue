import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import Loader from "../components/Loader"; 

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
const schema = z.object({
  email: z
    .string()
    .min(5, "Too short")
    .max(254, "Too long")
    .regex(emailRegex, "Email format is invalid"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/\d/, "Must include a number")
    .regex(/[\W_]/, "Must include a special character"),
});

type FormValues = z.infer<typeof schema>;

const theme = {
  background: "#1A1A2E",
  color: "#FFFFFF",
  primaryColor: "#0F3460",
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setFirebaseError(null);
    setLoading(true); 

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      const adminDoc = doc(collection(db, "admins"), user.uid);
      const adminSnap = await getDoc(adminDoc);

      if (adminSnap.exists()) {
        localStorage.setItem("isAdmin", "true");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        await auth.signOut();
        setFirebaseError("You are not authorized as admin");
        setLoading(false);
      }
    } catch (err: unknown) {
      setLoading(false);

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/invalid-email":
          case "auth/wrong-password":
            setFirebaseError("You are not authorized as admin");
            break;
          case "auth/too-many-requests":
            setFirebaseError("Too many attempts. Try again later");
            break;
          default:
            setFirebaseError("Something went wrong. Please try again");
        }
      } else {
        setFirebaseError("Unexpected error. Try again");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className="h-screen w-screen flex justify-center items-center font-['Poppins']"
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
          }}
        />

        <div
          className="relative z-10 p-8 rounded-lg"
          style={{
            border: "1px solid hsla(0, 0%, 65%, 0.158)",
            boxShadow: "0 0 36px 1px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          <h1 className="text-4xl text-center mb-8 opacity-60">LOGIN</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("email")}
              placeholder="Email"
              className="block w-full p-3.5 my-4 rounded-md outline-none font-medium"
              style={{ color: theme.color, backgroundColor: "#9191911f" }}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}

            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="block w-full p-3.5 my-4 rounded-md outline-none font-medium"
              style={{ color: theme.color, backgroundColor: "#9191911f" }}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}

            {firebaseError && (
              <p className="text-lg text-red-400 text-center">
                {firebaseError}
              </p>
            )}

            <button
              type="submit"
              className="block w-full p-3 mt-6 mb-6 rounded-md font-bold opacity-60 transition-all duration-100 hover:scale-105"
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.color,
              }}
            >
              SUBMIT
            </button>
          </form>
        </div>

        <div
          className="absolute w-32 h-32 rounded-full z-11"
          style={{
            background: theme.primaryColor,
            bottom: 0,
            right: 0,
            transform: "translate(45%, 45%)",
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm;
