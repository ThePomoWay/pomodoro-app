export function AddTaskIcon(props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="20" height="20" fill="inherit" />
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="#7586E3" />
      <path
        d="M13.5 10.4375H10.4375V13.5H9.5625V10.4375H6.5V9.5625H9.5625V6.5H10.4375V9.5625H13.5V10.4375Z"
        fill="#7586E3"
      />
    </svg>
  );
}
