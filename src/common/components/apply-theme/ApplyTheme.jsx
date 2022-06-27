import { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../state/selectors";

import { light } from "../../../styles/themes/light-theme";
import { dark } from "../../../styles/themes/dark-theme";
import { THEME_DARK } from "../../utils/constants";

export function ApplyTheme({ children }) {
  let theme = useSelector(selectTheme);

  const updateCSSVariables = (themeStr) => {
    let theme = light;
    if (themeStr === THEME_DARK) {
      theme = dark;
    }
    const arrayOfVariableKeys = Object.keys(theme);
    const arrayOfVariableValues = Object.values(theme);

    //Loop through each array key and set the CSS Variables
    arrayOfVariableKeys.forEach((cssVariableKey, index) => {
      //Based on our snippet from MDN
      document.documentElement.style.setProperty(
        cssVariableKey,
        arrayOfVariableValues[index]
      );
    });
  };

  //On Component Mount and Component Update
  useEffect(() => {
    updateCSSVariables(theme);
  }, [theme]);
  return <Fragment>{children}</Fragment>;
}
