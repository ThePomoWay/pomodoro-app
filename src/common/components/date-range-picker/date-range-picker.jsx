import { DateRangePicker } from "rsuite";

const { afterToday } = DateRangePicker;

export default function CustomDateRangePicker(props) {
  return (
    <div>
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
