import { Slider } from "@material-ui/core";
import { SettingsSideNav } from "../../common/components/settings-side-nav/SettingsSideNav";
import styles from "./Settings.module.scss";

import { Switch, Route, useRouteMatch } from "react-router-dom";
import Navbar from "../../common/components/navbar/Navbar";
import { ProfileSettings } from "../../common/components/profile-settings/ProfileSettings";
import { ClockSettings } from "../../common/components/clock-settings/ClockSettings";
import { SoundSettings } from "../../common/components/sound-settings/SoundSettings";

export default function Settings(props) {
  let { path } = useRouteMatch();

  return (
    <div className={styles["settings-container"]}>
      <Navbar />

      <div className={styles["main"]}>
        <div className={styles["sidebar"]}>
          <SettingsSideNav />
        </div>
        <div className={styles["settings"]}>
          <Switch>
            <Route exact path={path}>
              <ProfileSettings />
            </Route>
            <Route exact path={`${path}/timer`}>
              <ClockSettings />
            </Route>
            <Route exact path={`${path}/sound`}>
              <SoundSettings />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}
