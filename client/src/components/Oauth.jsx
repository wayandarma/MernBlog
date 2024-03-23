import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { UseDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";
function Oauth() {
  const navigate = useNavigate();
  const dispatch = UseDispatch();
  const auth = getAuth(app);
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);

      const { displayName, email, photoURL } = resultFromGoogle.user;
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: displayName,
          email,
          photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      onClick={handleGoogleLogin}
    >
      <AiFillGoogleCircle className="size-6 mr-2" /> Continue with google
      account
    </Button>
  );
}

export default Oauth;
