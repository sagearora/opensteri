import { useRouteError } from "react-router-dom";

export default function ErrorScreen() {
  const error = useRouteError() as {
    statusText?: string;
    message?: string
  };

  return (
    <div className="container min-h-screen flex flex-col justify-center">
      <h1 className="text-xl">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}