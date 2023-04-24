/**
 * Payment error page.
 */
const PaymentErrorPage = () => {
  return (
    <div className="grid place-items-center">
      <div className="flex flex-col text-center">
        <h1 className="text-2xl font-bold text-red-600">ERROR</h1>
        <p>Unable to access payment</p>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
