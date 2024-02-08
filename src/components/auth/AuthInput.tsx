interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const AuthInput = ({ label, ...rest }: AuthInputProps) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        {...rest}
        className={
          "block w-full rounded-none rounded-l-md border-0 py-1.5 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-inset"
        }
      />
    </div>
  );
};

export default AuthInput;
