import { FC, useContext, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AuthInput from "./UserDetailsInput";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import useAuthState from "../../hooks/useAuthState";
import { User } from "../../services/auth/auth.services";
import { UserDB, updateUserInDatabase } from "../../services/firestore/user/user";
import { rolesList } from "../../utils/roles/roles";
import { UserDetailsContext } from "./UserDetailsDialog";
import UserDetailsInput from "./UserDetailsInput";
import UserDetailsInputSelect from "./UserDetailsInputSelect";

const UserDetailsForm: FC = () => {
  const {
    onSubmitUserDetailsSuccess,
    onSubmitUserDetailsError,
  } = useContext(UserDetailsContext);

  const { userID } = useAuthState();

  /** Form schema validation using zod
   *
   * Schema:
   *  - username (required, string)
   * - company (string, optional)
   * - position (required, string)
   *
   * For more information about zod, check the documentation: https://zod.dev/
   * */
  const formSchema = z.object({
    username: z
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username should be a string",
      }),
    company: z
      .string({
        required_error: "Company name is required",
        invalid_type_error: "Company name should be a string",
      }),
    position: z
      .string({
        required_error: "Position is required",
        invalid_type_error: "Position should be a string",
      })
  })

  type UserDetailsSchema = z.infer<typeof formSchema>

  const methods = useForm<UserDetailsSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = methods;

  /* const countries = useMemo(
    () => countriesList.map((country) => country.name),
    [],
  ); */
  const roles = useMemo(() => rolesList.map((role) => role.name), []);

  const submitUserDetails = (data: UserDetailsSchema) => {
    const userDetails: Partial<UserDB> = {
      username: data.username,
      company: data.company,
      position: data.position,
    };

    updateUserInDatabase(userID, userDetails).then(() => {
      const localStorageUser = JSON.parse(localStorage.getItem("user")!);

      const updatedUser: User = {
        ...localStorageUser,
        userData: {
          ...localStorageUser.userData,
          ...userDetails,
        }
      }

      onSubmitUserDetailsSuccess(updatedUser);
    }).catch((error) => {
      onSubmitUserDetailsError(error);
    });
  };

  return (
    <>
      <div className="w-full">
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(submitUserDetails)}>
            <div>
              <UserDetailsInput
                id="username"
                type="text"
                name="username"
                label="Username"
                placeholder="walterwhite"
                required
              />
            </div>
            <div className="flex justify-between gap-x-3 border-t border-gray-200 pt-3">
              <AuthInput
                label="Company Name"
                type="text"
                name="company"
                id="company-name"
                placeholder="Company Inc."
                required
              />
              <UserDetailsInputSelect
                id="position"
                name="position"
                label="Position"
                options={roles}
                placeholder="Select a position"
                required
              />
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Submit
            </button>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default UserDetailsForm;
