import "react-phone-number-input/style.css";
import ReactPhoneInput from "react-phone-number-input";

export default function PhoneInput({
  onChange,
  value,
  label,
  required,
  inputKey,
  ...rest
}: {
  onChange: (value: string) => void;
  value?: string;
  label?: string;
  required?: boolean;
  inputKey?: string;
} & React.ComponentProps<typeof ReactPhoneInput>) {
  return (
    <div>
      {label && (
        <label className="text-sm font-medium" htmlFor={inputKey}>
          {label}
        </label>
      )}
      {required && <span className="text-red-500"> *</span>}
      <ReactPhoneInput
        id={inputKey}
        value={value}
        onChange={(val) => onChange(String(val))}
        defaultCountry="SG"
        {...rest}
      />
    </div>
  );
}
