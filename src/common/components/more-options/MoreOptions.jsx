export function MoreOptions(props) {
  return (
    <div className="popper-container">
      {props.items &&
        props.items.map((item, index) => {
          return (
            <div
              className="popper-item"
              onClick={(e) => props.onClick && props.onClick(index)}
            >
              {item.icon}
              {item.text}
            </div>
          );
        })}
    </div>
  );
}
