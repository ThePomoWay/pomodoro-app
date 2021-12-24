import styles from "./navbarDesktop.module.scss";
import { Menu, WbSunny, Timeline, Waves } from "@material-ui/icons";
import { Link } from "react-router-dom";

let navItems = [
    {
        icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.16666" y="2.16797" width="15.6667" height="5.66667" rx="1.16667" stroke="currentColor"/>
        <rect x="2.16666" y="12.168" width="15.6667" height="5.66667" rx="1.16667" stroke="currentColor"/>
        </svg>),
        title: "All Tasks",
        to: '/all'
    },
    {
        icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10.3666" cy="10" r="5" stroke="currentColor"/>
        <line x1="10.5" y1="0.832031" x2="10.5" y2="3.03203" stroke="currentColor"/>
        <line x1="10.5" y1="16.9648" x2="10.5" y2="19.1648" stroke="currentColor"/>
        <line x1="15.0163" y1="2.31055" x2="13.9163" y2="4.2158" stroke="currentColor"/>
        <line x1="6.94964" y1="16.2813" x2="5.84964" y2="18.1865" stroke="currentColor"/>
        <line x1="18.1888" y1="5.84903" x2="16.2835" y2="6.94903" stroke="currentColor"/>
        <line x1="4.21661" y1="13.9154" x2="2.31136" y2="15.0154" stroke="currentColor"/>
        <line x1="19.1667" y1="10.5" x2="16.9667" y2="10.5" stroke="currentColor"/>
        <line x1="3.03336" y1="10.5" x2="0.833356" y2="10.5" stroke="currentColor"/>
        <line x1="17.6885" y1="15.015" x2="15.7833" y2="13.915" stroke="currentColor"/>
        <line x1="3.71667" y1="6.94864" x2="1.81142" y2="5.84864" stroke="currentColor"/>
        <line x1="14.1503" y1="18.1875" x2="13.0503" y2="16.2822" stroke="currentColor"/>
        <line x1="6.08365" y1="4.2168" x2="4.98365" y2="2.31154" stroke="currentColor"/>
        </svg>),
        title: "Today's Tasks",
        to: '/'
    },
    {
        icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_355_741)">
        <path d="M5.95979 10.2203L6.16812 9.8595L5.84619 9.67364L5.62495 9.97236L5.95979 10.2203ZM11.7415 13.5584L11.5332 13.9193L11.867 14.112L12.0851 13.7942L11.7415 13.5584ZM18.1024 4.80962C18.0603 4.58338 17.8428 4.43411 17.6165 4.47621L13.9298 5.16226C13.7036 5.20436 13.5543 5.42189 13.5964 5.64813C13.6385 5.87436 13.8561 6.02363 14.0823 5.98153L17.3594 5.37171L17.9692 8.64878C18.0113 8.87502 18.2288 9.02429 18.455 8.98219C18.6813 8.94009 18.8306 8.72256 18.7885 8.49633L18.1024 4.80962ZM1.75862 16.593L6.29462 10.4683L5.62495 9.97236L1.08895 16.097L1.75862 16.593ZM5.75145 10.5812L11.5332 13.9193L11.9498 13.1976L6.16812 9.8595L5.75145 10.5812ZM12.0851 13.7942L18.0363 5.1216L17.3492 4.65009L11.398 13.3227L12.0851 13.7942Z" fill="currentColor"/>
        </g>
        <defs>
        <clipPath id="clip0_355_741">
        <rect width="20" height="20" fill="white"/>
        </clipPath>
        </defs>
        </svg>),
        title: "Insights",
        to: '/analysis'
    }
];
export default function NavbarDesktop(props) {
    return (
    <div className={styles["navbar"]}>
        <span className={styles["app"]}>
            <span className={styles["title"]}>PomöPanda</span>
        </span>

        <div className={styles["links"]}>
            <div className={styles['link-items']}>
            {navItems.map((item, index) => (<Link key={index} to={item.to} className={`${styles['link-item']} ${styles['link-item-'+(index+1)]} ${String(index) === props.selected ? styles['selected']: ''}`}>
                {item.icon}{item.title}</Link>))}
            {/* <span className={styles["link-item"]}><Menu /></span> */}
            </div>
        </div>
    </div>)
}