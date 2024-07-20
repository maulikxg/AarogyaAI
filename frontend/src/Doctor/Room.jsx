import Navbar from "../Navbar/NavBar";
import { useLoaderData } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { GoogleLogin } from "@react-oauth/google";
import button_logo from "/button_logo/button_logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FallBackUi from "../Fallback/FallbackUi";
import "./doctor.css";
import BACKEND_URL from "../services/api";
import axios from "axios";
import SuccessMessage from "../FlashyMessage/SuccessMessage";
import DuplicateEmail from "../FlashyMessage/DuplicateEmail";
import PatientPhoto from "/thumbnails/patient.png";
import Copyright from "../Copyright/Copyright";
function Room() {
  const role = useLoaderData();
  const navigate = useNavigate();
  const [isPatient, setIsPatient] = useState(role === "patient" ? true : false);
  const [isDoctor, setIsDoctor] = useState(role === "doctor" ? true : false);
  const [isLogout, setIsLogout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [showFlashy, setShowFlashy] = useState(false);
  if (isLoading === true) {
    return <FallBackUi />;
  }
  if (isLoading === false && isEmailDuplicate === true) {
    return (
      <>
        {" "}
        <Navbar isPatient={!isPatient} isDoctor={!isDoctor} />
        <DuplicateEmail
          message={"Only one doctor is allowed in the room at any given time."}
        />
        <h1 className="signHeading">Sign in as Patient</h1>
        <div className="mainLogin">
          <img
            draggable="false"
            className="patient_image"
            src={PatientPhoto}
            alt="Patient"
          />
          <div className="login_with_google2">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setIsLoading(true);
                let data = await axios.post(
                  `${BACKEND_URL}/api/auth/generateTokenP`,
                  {
                    token: credentialResponse.credential,
                  }
                );
                if (data.data.token === "tokenNotGranted") {
                  setIsEmailDuplicate(true);
                  setIsLoading(false);
                  return;
                }
                localStorage.setItem("token", data.data.token);
                setIsPatient(true);
                setIsLogout(true);
                setIsLoading(false);
                setIsEmailDuplicate(false);
                setShowFlashy(true);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            <img
              draggable="false"
              src={button_logo}
              height={"230px"}
              width={"230px"}
              alt="Google Login"
              style={{ padding: "20px", boxSizing: "border-box" }}
            />
          </div>
        </div>
        <Copyright />
      </>
    );
  }
  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }
  const { id } = useParams();
  // console.log(id);
  const roomID = id || randomID(5);
  const myMeeting = async (element) => {
    const appID = 1381775377;
    const serverSecret = "2d4a506c26ad51f90d95b5d031214c66";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      id,
      randomID(5),
      randomID(5)
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `https://app.connect-health.xyz/doctor/schedule/${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      onLeaveRoom: () => {
        navigate("/");
        // shoutout to the Aditya Sharma for building this 🙏
      },
    });
  };
  // removing patient role because patient they are the only one who will be joining the room

  if (role === "noRole" && isPatient === false && isDoctor === false) {
    return (
      <>
        <Navbar isPatient={!isPatient} isDoctor={!isDoctor} />
        <h1 className="signHeading">Sign in as Patient</h1>
        <div className="mainLogin">
          <img
            draggable="false"
            className="patient_image"
            src={PatientPhoto}
            alt="Patient"
          />
          <div className="login_with_google2">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setIsLoading(true);
                let data = await axios.post(
                  `${BACKEND_URL}/api/auth/generateTokenP`,
                  {
                    token: credentialResponse.credential,
                  }
                );
                if (data.data.token === "tokenNotGranted") {
                  setIsEmailDuplicate(true);
                  setIsLoading(false);
                  return;
                }
                localStorage.setItem("token", data.data.token);
                setIsPatient(true);
                setIsLogout(true);
                setIsLoading(false);
                setIsEmailDuplicate(false);
                setShowFlashy(true);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
            <img
              draggable="false"
              src={button_logo}
              height={"230px"}
              width={"230px"}
              alt="Google Login"
              style={{ padding: "20px", boxSizing: "border-box" }}
            />
          </div>
        </div>
        <Copyright />
      </>
    );
  }
  return (
    <>
      <Navbar isPatient={isPatient} isDoctor={isDoctor} isLogout={true} />
      {showFlashy && (
        <SuccessMessage message={"You're Now Logged in as a Patient"} />
      )}
      <div style={{ marginBottom: "200px" }}>
        <div ref={myMeeting} />
      </div>
      <Copyright />
    </>
  );
}

export default Room;
