export const SequenceInput = ({
  userSequence,
  setUserSequence,
  userInputSequence,
  setUserInputSequence,
}) => {
  return (
    <div>
      {true ? (
        <div>
          <div className="flex mt-1">
            <input
              id="user-input-name"
              className={`px-2 text-[1.2rem] w-[100%] h-[1.9rem]`}
              style={{ fontFamily: "monospace",
            backgroundColor: 'rgba(0,0,0,0)' }}
              value={userSequence}
              defaul
              onChange={(e) => {
                setUserSequence(e.target.value);
              }}
            />
          </div>
          {/* <div className="flex mt-[0.25rem]">
            <div
              className="overflow-y-scroll p-2 w-[25rem] min-h-[4rem] max-h-[6rem] h-[6rem] bg-[#333] rounded-[0.25rem]"
              style={{ fontFamily: "monospace" }}
            >
              <p className="break-all select-text">{userInputSequence}</p>
            </div>
          </div> */}
        </div>
      ) : (
        <div className="flex mt-[0.25rem] pointer-events-none">
          <textarea
            id="user-input-dna"
            className="text-wrap p-2 w-[25rem] min-h-[4rem] max-h-[6rem] h-[6rem] bg-[#555] rounded-[0.25rem]"
            style={{ fontFamily: "monospace" }}
            value={userInputSequence}
            onChange={(e) => setUserInputSequence(e.target.value)}
          >
            {userInputSequence}
          </textarea>
        </div>
      )}
    </div>
  );
};
