import { useEffect, useRef } from "react";
import $ from "jquery";
import "selectize";

export default function SelectizeInput({
  name,
  value,
  options = [],
  onChange,
  placeholder = "Select option",
  error,
}) {
  const selectRef = useRef(null);

  useEffect(() => {
    const $select = $(selectRef.current);

    const instance = $select.selectize({
      valueField: "value",
      labelField: "label",
      searchField: "label",
      create: false,
      placeholder,
      options,
      onChange: (val) => {
        onChange({
          target: {
            name,
            value: val,
          },
        });
      },
    });

    const control = instance[0].selectize;

    // Set initial value
    if (value) {
      control.setValue(value, true);
    }

    return () => {
      control.destroy();
    };
  }, []);

  useEffect(() => {
    const control = $(selectRef.current)[0]?.selectize;
    if (control && value !== control.getValue()) {
      control.setValue(value, true);
    }
  }, [value]);

  return (
    <div className="space-y-1">
      <select ref={selectRef} defaultValue={value || ""}>
        <option value="">{placeholder}</option>
      </select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}