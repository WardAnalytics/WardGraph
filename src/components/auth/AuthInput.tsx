import clsx from "clsx";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  className?: string;
}

const AuthInput = ({
  label,
  name,
  className,
  ...rest
}: AuthInputProps) => {
  const { register, formState: { errors } } = useFormContext();

  const error = useMemo(() => errors[name], [errors, name]);

  return (
    <div className={clsx('w-full', className)}>
      <label
        htmlFor={label}
        className="flex gap-x-1 mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        <span>
          {label}
        </span>
        {
          rest.required &&
          <span className="text-red-500">*</span>
        }
      </label>
      <input
        {...register(name)}
        {...rest}
        className={
          "block w-full rounded-md border-0 py-1.5 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
        }
      />
      {error &&
        <p className="mt-2 text-red-500 text-xs">
          {error.message?.toString()}
        </p>
      }
    </div>
  );
};

export default AuthInput;
