export function CustomSlider(props) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        onChange={(e) => {
          props.onChange && props.onChange(e);
        }}
        defaultChecked={props.defaultChecked}
      />
      <span className="slider round"></span>
    </label>
  );
}
