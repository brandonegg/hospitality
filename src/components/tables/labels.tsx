/**
 * Display # of elements for the object and the name of the object on the page.
 */
const TablePageHeader = ({
  label,
  count,
}: {
  label: string;
  count?: number;
}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">All {label}</h1>
      <p className="font-normal">
        {count ?? 0} {label.toLowerCase()}
      </p>
    </div>
  );
};

export { TablePageHeader };
