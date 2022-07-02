import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <div className={styles["footer-container"]}>
      <div className={styles["first"]}>
        <img className={styles["img"]} src="/logo/logo-title.svg" />
        <p>Zenpanda Technologies Private Limited</p>

        <p>Plot no. 12, Road no. 14, Sector 12, Navi Mumbai, Maharashtra, 🇮🇳</p>
      </div>
      <div className={styles["second"]}>
        <a className={styles["link"]} href="/about-us">
          About Us
        </a>
        <a className={styles["link"]} href="/sitemap.xml">
          Sitemap
        </a>
        <a className={styles["link"]} href="mailto:feedback@timedojo.io">
          Feedback
        </a>
        <a className={styles["link"]} href="/privacy-policy">
          Privacy Policy
        </a>
      </div>
      <div className={styles["third"]}>
        <p className={styles["title"]}>Our Apps</p>
        <div className={styles["extension"]}>
          <img className="ext-img" src="/logo/logo-round.svg" />
          <div>
            <p className={styles["white"]}>Chome Extension</p>
            <a
              className={styles["link"]}
              href="https://chrome.google.com/webstore/detail/timedojo-pomodoro-app-to/cennnfekpcbgoajenlkfhhgcpmjddhfh?hl=en-GB&authuser=3"
            >
              Download Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
