import { useState } from "react";
import styles from "./TaskDescription.module.scss";

export default function TaskDescription(props) {
  let isBulleted = props.isBulleted;

  let [value, setValue] = useState(props.value || "");
  let [noLines, setNoLines] = useState(0);

  let splitVal = [];
  if (props.value) {
    splitVal = props.value.split("\n");
    noLines = splitVal.length;
  }
  let [lastLine, setLastLine] = useState(splitVal[splitVal.length - 1] || "");

  let onKeyDownBullet = (e) => {
    if (e.code === "Enter" && lastLine.length > 0) {
      if (noLines === 0) {
        setValue(lastLine + "\n");
      } else {
        setValue(value + lastLine + "\n");
      }

      setLastLine("");

      setNoLines(noLines + 1);
    }
    if (e.code === "Backspace" && lastLine.length === 0) {
      let splitLine = value.split("\n");
      if (splitLine.length > 1) {
        setValue(splitLine.slice(0, -1).join("\n"));
        setLastLine(splitLine[splitLine.length - 2]);
        setNoLines(noLines - 1);
      }
    }
  };

  let onChangeBullet = (e) => {
    setLastLine(e.target.value);
    props.onChange && props.onChange(value + e.target.value);
  };

  let onChangeValue = (e) => {
    props.onChange && props.onChange(e.target.value);
  };
  if (isBulleted) {
    let splitValue = value.split("\n");
    return (
      <div className={styles["description-bullet"]}>
        {splitValue.map((item, index) => (
          <div className={styles.descitem} key={index}>
            <span className={styles.bullet}></span>
            {(index !== splitValue.length - 1 && <span>{item}</span>) || (
              <input
                autoFocus
                className={styles["desc-input"]}
                onChange={onChangeBullet}
                onKeyDown={onKeyDownBullet}
                value={lastLine}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={styles["description-value"]}>
      <div className={styles["desc-input"]}>
        <input
          placeholder="Enter Task description here"
          onChange={onChangeValue}
          value={props.value}
        />
      </div>
    </div>
  );
}
