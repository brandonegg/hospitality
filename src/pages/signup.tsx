import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * Error message react component.
 * @param children Error message.
 * @returns
 */
function ErrorMessage({ children }: { children: string | undefined }) {
  return <span className="text-red-500">{children}</span>;
}

/**
 * Sign Up page react component.
 * @returns JSX
 */
const SignUp: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  /**
   * Form submit handler.
   * @param data Form data.
   * @returns
   */
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Hospitality Sign Up" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 rounded-lg border border-gray-500 p-2"
        >
          <span className="text-center text-3xl font-bold">Sign Up</span>

          <div className="flex items-stretch gap-2">
            <div className="flex flex-grow flex-col">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                placeholder="John"
                className="rounded border border-gray-300 p-2"
                {...register("firstName", {})}
              />
            </div>

            <div className="flex flex-grow flex-col">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="rounded border border-gray-300 p-2"
                {...register("lastName", {})}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              className="rounded border border-gray-300 p-2"
              {...register("dateOfBirth", {})}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="johndoe"
              className="rounded border border-gray-300 p-2"
              {...register("username", {})}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="johndoe@example.com"
              className="rounded border border-gray-300 p-2"
              {...register("email", {})}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="rounded border border-gray-300 p-2"
              {...register("password", {})}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="rounded border border-gray-300 p-2"
              {...register("confirmPassword", {})}
            />
          </div>

          <input
            type="submit"
            value="Sign Up"
            className="cursor-pointer rounded bg-indigo-500 p-2 text-white hover:bg-indigo-600"
          />
          <Link
            href="/"
            className="rounded p-2 text-center text-indigo-500 hover:bg-indigo-100"
          >
            Back
          </Link>
        </form>
      </main>
    </>
  );
};

export default SignUp;
