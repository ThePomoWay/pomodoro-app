export function RemoveTaskIcon(props) {
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
      <rect x="7" y="10" width="6" height="1" fill="#7586E3" />
    </svg>
  );
}
