import styles from "./DotGrid.module.scss";

export function DotGrid({ rows, columns }) {
  return (
    <div className={styles["dots"]}>
      {[...Array(rows || 6)].map((_) => {
        return (
          <div className={styles["dot-row"]}>
            {[...Array(columns || 6)].map((_) => (
              <div className={styles["dot"]}></div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
