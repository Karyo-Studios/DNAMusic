export const RemixButton = ({ generatePattern }) => {
  return (
    <div className="px-[0.5rem] remix">
      <div
        onClick={() => {
          generatePattern();
        }}
      >
        <button className="h-[2rem] w-[2rem] bg-[#393939] hover:bg-[#666] px-[0.5rem] rounded-[0.25rem]">
          <div className=" m-auto">
            <svg
              width="1rem"
              height="1rem"
              viewBox="0 0 30 30"
              fill="#ddd"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 3C0 1.34314 1.34375 0 3 0H27C28.6562 0 30 1.34314 30 3V27C30 28.6569 28.6562 30 27 30H3C1.34375 30 0 28.6569 0 27V3ZM13 9.5C13 11.433 11.4336 13 9.5 13C7.56641 13 6 11.433 6 9.5C6 7.56702 7.56641 6 9.5 6C11.4336 6 13 7.56702 13 9.5ZM21.5 13C23.4336 13 25 11.433 25 9.5C25 7.56702 23.4336 6 21.5 6C19.5664 6 18 7.56702 18 9.5C18 11.433 19.5664 13 21.5 13ZM13 21.5C13 23.433 11.4336 25 9.5 25C7.56641 25 6 23.433 6 21.5C6 19.567 7.56641 18 9.5 18C11.4336 18 13 19.567 13 21.5ZM21.5 25C23.4336 25 25 23.433 25 21.5C25 19.567 23.4336 18 21.5 18C19.5664 18 18 19.567 18 21.5C18 23.433 19.5664 25 21.5 25Z"
                fill="#ddd"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
