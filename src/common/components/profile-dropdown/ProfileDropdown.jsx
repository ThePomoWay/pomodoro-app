import { ArrowDropDown } from "@material-ui/icons";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import AuthService from "../../API/network/AuthService";

import styles from "./ProfileDropdown.module.scss";

export function ProfileDropdown(props) {

    let [isOpen, setIsOpen] = useState(false);

    let dispatch = useDispatch();

    let onLogout = useCallback(() => {
        AuthService.logout();
    });

    return (
        <div className={styles['profile']} onClick={(e) => setIsOpen(!isOpen)}>
            <img src="/default.png" />
            <span className={`${styles['arrow']} ${isOpen && styles['open']}`}>
                <ArrowDropDown />
            </span>

            {isOpen && (
                <div className={styles['profile-dropdown']} onClick={(e) => e.stopPropagation()}>
                    <div className={styles['profile-dropdown-item']}>
                        Settings
                    </div>
                    <div className={styles['profile-dropdown-item']} onClick={(e) => onLogout()}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    )
}