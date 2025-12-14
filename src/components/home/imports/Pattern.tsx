function Pattern() {
  return (
    <div className="relative size-full" data-name="pattern">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 414 1321">
        <g id="pattern">
          <rect width="100%" height="100%" fill="#E6F6F0" />
        </g>
      </svg>
    </div>
  );
}

export default function Pattern1() {
  return (
    <div className="relative size-full" data-name="pattern">
      <div className="absolute bottom-[49.25%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none h-[1320.21px] rotate-[90.511deg] w-[413.745px]">
          {[...Array(2).keys()].map((_, i) => (
            <Pattern key={i} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 flex items-center justify-center left-0 right-0 top-[49.25%]">
        <div className="flex-none h-[1320.21px] rotate-[90.511deg] w-[413.745px]" />
      </div>
    </div>
  );
}
