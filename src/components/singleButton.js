export const SingleButton = ({
    children,
    onClick,
    buttonStyle,
  }) => {
    return (
      <div className="flex items-center">
        <button
          className="font-bold bg-[#555] hover:bg-[#888] py-1 w-[1.5rem] rounded-[0.25rem]"
          style={buttonStyle}
          onClick={onClick}
        >
        {children}
        </button>
      </div>
    );
  };
  