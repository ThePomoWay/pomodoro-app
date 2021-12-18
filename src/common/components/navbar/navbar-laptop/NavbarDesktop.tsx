import styles from "./navbarDesktop.module.scss";
import { Menu, WbSunny, Timeline, Waves } from "@material-ui/icons";
import { Link } from "react-router-dom";

let navItems = [
    {
        icon: (<Waves />),
        title: "All Tasks",
        to: '/all'
    },
    {
        icon: (<WbSunny />),
        title: "Today's Tasks",
        to: '/'
    },
    {
        icon: (<Timeline />),
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
            {navItems.map((item, index) => (<Link key={index} to={item.to} className={`${styles['link-item']} ${styles['link-item-'+(index+1)]} ${String(index) === props.selected ? styles['selected']: ''}`}>
                {item.icon}{item.title}</Link>))}
            {/* <span className={styles["link-item"]}><Menu /></span> */}
        </div>
    </div>)
}