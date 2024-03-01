import clsx from "clsx";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

interface UserDetailsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  className?: string;
}

const UserDetailsInput = ({ label, name, className, ...rest }: UserDetailsInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = useMemo(() => errors[name], [errors, name]);

  return (
    <div className={clsx("w-full", className)}>
      <label
        htmlFor={label}
        className="mb-2 block gap-x-1 text-sm font-medium text-gray-900 dark:text-white"
      >
        <span>{label}</span>
        {rest.required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        {...rest}
        className={
          "block w-full rounded-md border-0 py-1.5 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:outline focus:outline-[3px] focus:outline-blue-200 focus:ring-2 focus:ring-blue-400"
        }
      />
      {error && (
        <p className="mt-2 text-xs text-red-500">{error.message?.toString()}</p>
      )}
    </div>
  );
};

export default UserDetailsInput;
