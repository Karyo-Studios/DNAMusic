import ReactSlider from 'react-slider'

export const SequenceBoundsSlider = ({
  sequenceBounds,
  setSequenceBounds,
  sequence,
  selectedSequence,
  sequenceRef,
  boundsRef,
  setShowHelpWindow,
  setHelpMessage,
}) => {
  return <div>
    <div className="relative text-[#888] w-full m-auto">
      <div className="absolute flex left-[1rem] top-[-1rem]">
        <p className="text-[0.8rem]">
          START{" "}
          <span className="text-[#fff] text-[0.8rem]">
            {sequenceBounds[0]}
            {"  -"}
          </span>
        </p>
        <p className="text-[0.8rem]">
          <span className="text-[#fff] text-[0.8rem]">
            &nbsp;
            {`${sequenceBounds[1]}`}
          </span>{" "}
          END
        </p>
      </div>
      <div className="absolute flex right-[1rem] top-[-1rem]">
        <p className="text-[0.8rem]">
          LENGTH{" "}
          <span className="text-[#fff] text-[0.8rem]">
            {sequenceBounds[1] - sequenceBounds[0]}/{sequence.length}
          </span>
        </p>
      </div>
      <div className="absolute flex justify-center right-[1rem] left-[1rem] top-[-1rem]">
        <p className="text-[0.8rem] cursor-pointer sequence-button"
          onClick={()=> {
            const helpMessage = {
              name: 'Current DNA sequence: ' + selectedSequence.name,
              description: selectedSequence.description,
            }
            
            setShowHelpWindow(true)
            setHelpMessage(helpMessage)
          }}
        >
          Sequence: {selectedSequence ? `${selectedSequence.name}` : ''}
        </p>
      </div>
      <div className="mt-[1.2rem]">
        <ReactSlider
          className="bounds-slider"
          thumbClassName="bounds-thumb"
          trackClassName="bounds-track"
          defaultValue={sequenceBounds}
          value={boundsRef.current}
          minDistance={
            sequenceRef.current.length > 6
              ? 6
              : sequenceRef.current.length
          }
          min={0}
          max={
            sequenceRef.current.length > 1
              ? sequenceRef.current.length
              : 1
          }
          pearling
          onChange={(value, index) => {
            setSequenceBounds(value);
          }}
        />
      </div>
    </div>
  </div>
}