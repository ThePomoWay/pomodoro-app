import { DateRangePicker } from "rsuite";

const { afterToday } = DateRangePicker;

export default function CustomDateRangePicker(props) {
  return (
    <div
      style={{
        display: "block",
        width: 600,
        paddingLeft: 30,
      }}
    >
      <h4>React Suite DateRangePicker Component</h4>
      <DateRangePicker
        style={{ width: 300 }}
        placeholder="Select Date Range"
        defaultValue={[
          new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          new Date(),
        ]}
        disabledDate={afterToday()}
        onChange={(e) => {
          props.getDates(e);
        }}
      />
    </div>
  );
}
