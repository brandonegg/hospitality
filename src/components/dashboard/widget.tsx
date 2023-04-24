interface SquareWidgetProperties {
  title?: string;
  width: 1 | 2; // Width of the widget relative to grid cells.
  children: JSX.Element;
}

/**
 * A square widget element for displaying useful information in the dashboard
 * @param param0
 * @returns
 */
const SquareWidget = ({ title, width, children }: SquareWidgetProperties) => {
  /**
   * Widget title generation
   * @returns
   */
  const Title = () => {
    if (!title) {
      return <></>;
    }
    return (
      <>
        <div className="bg-slate-800 text-gray-300">
          <div className="p-1">
            <h1 className="text-center text-lg font-bold">{title}</h1>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={width == 2 ? "col-span-2" : "col-span-1"}>
        <div className="overflow-hidden rounded-xl border border-gray-600 drop-shadow-lg">
          <Title />
          {children}
        </div>
      </div>
    </>
  );
};

export { SquareWidget };
