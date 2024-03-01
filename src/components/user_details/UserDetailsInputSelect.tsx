import { FC, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Listbox from "../common/Listbox";
import clsx from "clsx";

interface UserDetailsInputSelectProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  options: string[];
  className?: string;
}

const UserDetailsInputSelect: FC<UserDetailsInputSelectProps> = ({
  label,
  name,
  options,
  className,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = useMemo(() => errors[name], [errors, name]);

  return (
    <div className={clsx("w-full", className)}>
      <label
        htmlFor={label}
        className="mb-2 flex gap-x-1 text-sm font-medium text-gray-900"
      >
        <span>{label}</span>
        {rest.required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Listbox
            onChange={onChange}
            onBlur={onBlur}
            options={options}
            selected={value}
            placeholder={rest.placeholder}
          />
        )}
        rules={{ required: rest.required }}
      />
      {error && (
        <p className="mt-2 text-xs text-red-500">{error.message?.toString()}</p>
      )}
    </div>
  );
};

export default UserDetailsInputSelect;
