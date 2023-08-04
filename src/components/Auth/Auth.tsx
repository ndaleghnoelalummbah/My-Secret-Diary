import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, FacebookAuthProvider } from "firebase/auth";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { authClasses } from "./authClasses";
import { AuthForm, authFormSchema } from "../../models/Form";
import { auth, db } from "../../firebase";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { login } from "../../features/authSlice";
import Button from "../Button";

const Auth = () => {
  const [authType, setAuthType] = useState<"login" | "sign-up">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<string | null>(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null);

  // call the authSlice object which is assigned to a name auth.its reducers return the the recent user
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (Boolean(user)) {
      navigate("/journal");
    }
  }, [user, navigate]);

  const { container, form, button, input, text, link, hr, forgotPasswordButton } = authClasses;

  const handlePasswordReset = async () => {
    if (!resetPasswordEmail.length) return;
    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      setResetPasswordSuccess("Password reset email sent. Please check your inbox.");
      setResetPasswordError(null);
    } catch (error: any) {
      setResetPasswordError(error.message);
      setResetPasswordSuccess(null);
    }
  };

  const signInWithGoogle = async () => {
    const googleprovider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, googleprovider);
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user.photoURL || null,
          })
        );
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  const signInWithFacebook = async () => {
    const facebookprovider = new FacebookAuthProvider();
    signInWithPopup(auth, facebookprovider)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err.message);
      });
      };

  const handleFormSubmit = async (data: AuthForm) => {
    setErrorMessage(null);
    setLoading(true);
    const { email, password } = data;
    if (authType === "sign-up") {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", user.uid), { email });
        setLoading(false);

        if (user && user.email)
          dispatch(
            login({
              email: user.email,
              id: user.uid,
              photoUrl: user.photoURL || null,
            })
          );
      } catch (error: any) {
        setLoading(false);
        const errorCode = error.code;
        setErrorMessage(errorCode);
      }
    } else {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user.photoURL || null,
          })
        );
    }
  };

  const handleAuthType = () => {
    setAuthType((prevAuthType) => (prevAuthType === "login" ? "sign-up" : "login"));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForm>({
    resolver: yupResolver(authFormSchema),
  });

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className={form}>
         <Button label="Sign in with Google" type="button" btnAction={signInWithGoogle} styleProps="bg-black max-w-lg mx-auto text-center text-white py-4 my-4 rounded-lg" />
          <Button label="Sign in with Facebook" type="button" btnAction={signInWithFacebook} styleProps="bg-black max-w-lg mx-auto text-center text-white py-4 my-4 rounded-lg" />
        </form>
      </div>
    </>
  );
};

export default Auth;

// try {
//   const { user } = await signInWithPopup(auth, facebookprovider);

//   if (user && user.email)
//     dispatch(
//       login({
//         email: user.email,
//         id: user.uid,
//         photoUrl: user.photoURL || null,
//       })
//     );
// } catch (error) {
//   console.log("Error signing in:", error);
// }
{
  /* 
            <div className="my-3 flex items-center px-3">
              <hr className={hr} />
              <span className={text}>or</span>
              <hr className={hr} />
            </div> */
}

{
  /* <div className="grid gap-y-3">
              <div>
                <input type="email" placeholder="email@example.com" className={input} {...register("email")} />
                {errors.email ? <span className="text-red-700">{errors.email.message}</span> : <></>}
              </div>
              <div>
                <input {...register("password")} type="password" placeholder="******" className={input} />
                {errors.password ? <span className="text-red-700">{errors.password.message}</span> : <></>}
              </div>
              <div>
                <input type="password" placeholder="confirm password" className={input} {...register("confirmPassword")} />
                {errors.confirmPassword ? <span className="text-red-700">{errors.confirmPassword.message}</span> : <></>}
              </div>

              <button disabled={loading} className={button}>
                Sign {authType === "login" ? "in" : "up"} with Email
              </button>
            </div> */
}

{
  /* <div className="text-sm font-light py-4">
              {authType === "login" ? (
                <span>
                  Don&apos;t have an account yet?{" "}
                  <span onClick={handleAuthType} className={link}>
                    Sign up
                  </span>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <span onClick={handleAuthType} className="font-medium cursor-pointer text-primary-600 hover:underline dark:text-primary-500">
                    Sign in
                  </span>
                </span>
              )}
            </div> */
}

{
  /* <div className="my-3 flex items-center px-3">
              <hr className={hr} />
              <button onClick={() => setResetPassword(true)} type="button" className={forgotPasswordButton}>
                forgot password
              </button>
              <hr className={hr} />
            </div> */
}
