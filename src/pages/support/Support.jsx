import Navbar from "../../common/components/navbar/Navbar";
import styles from "../privacy-policy/PrivacyPolicy.module.scss";
export default function Support() {
  return (
    <div className="container">
      <Navbar /> 
      <div className={styles["main-content"]}>
        <h1 className="font-title">Contact Us!</h1>
        <p className="font-info">
          Zenpanda Technologies Private Limited
          <p className="font-info">
            Tower 1, Seawoods Railway Station 10th Floor, Sector 40, Navi
            Mumbai, Maharashtra 400706, 🇮🇳
          </p>
        </p>

        <h3 className="font-sub-heading">Contact us on:</h3>
        <p>+91 7021287145</p>
        <h3 className="font-sub-heading">Email us on:</h3>
        <p className="font-info">
          <a
            href="mailto:feedback@timedojo.io"
            target="_blank"
          >
            feedback@timedojo.io
          </a>
        </p>
      </div>
    </div>
  );
}
