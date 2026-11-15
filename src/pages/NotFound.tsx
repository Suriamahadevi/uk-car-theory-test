import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <h1 className="govuk-heading-xl">Page not found</h1>
      <p className="govuk-body">If you typed the web address, check it is correct.</p>
      <p className="govuk-body"><Link className="govuk-link" to="/">Go to your dashboard</Link></p>
    </>
  );
}
