import styles from "./DotGrid.module.scss";

export function DotGrid({ rows, columns }) {
  return (
    <div className={styles["dots"]}>
      {[...Array(rows || 6)].map((_, index) => {
        return (
          <div key={"dot_row_" + index} className={styles["dot-row"]}>
            {[...Array(columns || 6)].map((_, index) => (
              <div key={"dot_col_" + index} className={styles["dot"]}></div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
