
import { FC, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Listbox from '../common/Listbox';
import clsx from 'clsx';

interface AuthInputSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  options: string[];
  className?: string;
}

const AuthInputSelect: FC<AuthInputSelectProps> = ({
  label,
  name,
  options,
  className,
  ...rest
}) => {
  const { control, formState: { errors } } = useFormContext();

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
      {error &&
        <p className="mt-2 text-red-500 text-xs">
          {error.message?.toString()}
        </p>
      }
    </div>
  )
}

export default AuthInputSelect
