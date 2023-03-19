import { Role } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import type { Popup, User } from "../../pages/users";
import ErrorMessage from "../ErrorMessage";

interface UserEditProps {
  user?: User;
  popup: Popup;
  setPopup: Dispatch<SetStateAction<Popup>>;
}

/**
 * UserEdit component
 * @param param0
 * @returns JSX
 */
const UserEdit = ({ user, setPopup }: UserEditProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<User> = (data) => {
    console.log(data);
    // mutate(data);
    setPopup({ show: false });
  };

  console.log(user);

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold">Name</h2>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="rounded border border-gray-300 p-2"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <ErrorMessage id="name-error">{errors.name.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            className="rounded border border-gray-300 p-[9.5px]"
            {...register("role", {
              required: "Role is required",
            })}
          >
            <option value={Role.PATIENT}>{Role.PATIENT}</option>
            <option value={Role.NURSE}>{Role.NURSE}</option>
            <option value={Role.DOCTOR}>{Role.DOCTOR}</option>
            <option value={Role.ADMIN}>{Role.ADMIN}</option>
          </select>
          {errors.role && (
            <ErrorMessage id="role-error">{errors.role.message}</ErrorMessage>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold">Other Information</h2>
      <div className="flex flex-col">
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
          type="date"
          id="dateOfBirth"
          className="rounded border border-gray-300 p-2"
          {...register("dateOfBirth", {
            required: "Date of birth is required",
          })}
        />
        {errors.dateOfBirth && (
          <ErrorMessage id="dateOfBirth-error">
            {errors.dateOfBirth.message}
          </ErrorMessage>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div className="flex flex-grow flex-col">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="rounded border border-gray-300 p-2"
            {...register("username", {
              required: "Username is required",
            })}
          />
          {errors.username && (
            <ErrorMessage id="username-error">
              {errors.username.message}
            </ErrorMessage>
          )}
        </div>

        <div className="flex flex-grow flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="rounded border border-gray-300 p-2"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <ErrorMessage id="email-error">{errors.email.message}</ErrorMessage>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 py-2 px-3 font-semibold text-white hover:bg-blue-700"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setPopup({ show: false })}
          className="inline-flex cursor-pointer items-center gap-2 rounded bg-red-600 py-2 px-3 font-semibold text-white hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserEdit;
