type InputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "textarea"
  | "gender";

interface InputProps {
  type?: InputType;
  autoComplete?: string;
  required?: boolean;
  label?: string;
  formik: any;
  name: string;
  onblur?: any;
  placeholder?: any;
  value?: any;
  onChange?: any;
  validate?: any;
  extra?: object;
  readonly?: boolean;
}

const ProfileInput = ({
  type,
  autoComplete,
  required,
  label,
  name,
  formik,
  placeholder,
  onblur,
  extra,
  readonly,
}: InputProps) => {
  return (
    <div className={styles.p0}>
      {label && (
        <label htmlFor={name} className={styles.p1}>
          {label}
        </label>
      )}
      <div className={styles.p4}>
        {type === "gender" ? (
          <select
            id={name}
            name={name}
            onChange={formik.handleChange}
            onBlur={onblur}
            value={formik.values[name]}
            required={required || false}
            className={styles.p2}
            {...extra}
          >
            <option value="" disabled hidden className="cursor-pointer">
              Select Gender
            </option>
            <option value="male" className="text-white bg-slate-500 w-1/4">
              Male
            </option>
            <option value="female" className="text-white bg-slate-500">
              Female
            </option>
            <option value="other" className="text-white bg-slate-500">
              Other
            </option>
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type || "text"}
            onChange={formik.handleChange}
            onBlur={onblur}
            value={formik.values[name]}
            autoComplete={autoComplete}
            required={required || false}
            placeholder={placeholder}
            className={styles.p2}
            readOnly={readonly}
            {...extra}
          />
        )}
        {formik.touched[name] && formik.errors[name] ? (
          <span className={styles.p3}>{formik.errors[name]}</span>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  p0: "mb-4",
  p1: "block text-sm mb-0 text-white ",
  p2: "mt-3 block w-full sm:w-1/2 placeholder:text-gray-500 text-white rounded bg-theme px-3 py-2 focus:outline-none  border-1  focus:ring-0 focus:border-b",
  p3: "text-red-500 text-sm",
  p4: "mt-0 text-black",
};

export default ProfileInput;
