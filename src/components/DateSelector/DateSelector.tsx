import "./DateSelector.css";

interface DateSelectorProps {
  dates: string;
  onPrev: () => void;
  onNext: () => void;
}

function DateSelector({ dates, onPrev, onNext }: DateSelectorProps) {
  return (
    <div className="d-flex flex-row justify-content-between align-items-center gap-2 w-200">
      <button className="btn-date" onClick={onPrev}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <g clipPath="url(#clip0_8008_261)">
            <path
              d="M14 8L10 12L14 16"
              stroke="#111111"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>
      {dates}
      <button className="btn-date" onClick={onNext}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <g clipPath="url(#clip0_8008_265)">
            <path
              d="M10 16L14 12L10 8"
              stroke="#111111"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}

export default DateSelector;
