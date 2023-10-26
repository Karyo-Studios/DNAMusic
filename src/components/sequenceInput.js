export const SequenceInput = ({
  userSequence,
  setUserSequence,
  width,
}) => {
  return (
    <div className="flex mt-1">
      <input
        id="user-input-name"
        className={`sequence-input text-[1.3rem] h-[1.9rem] text-center mx-auto mt-3 border-b-[1px] border-b-[#aaa] hover:border-b-[#fff]`}
        style={{
          backgroundColor: 'rgba(0,0,0,0)',
          width: width ? width : '17rem',
        }}
        value={userSequence}
        onChange={(e) => {
          setUserSequence(e.target.value);
        }}
      />
    </div>
  );
};
