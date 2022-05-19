import React from "react";

const SearchInput = () => {
    return(
    <div className="relative flex w-full flex-wrap items-stretch mb-3">
  <span
    className="
      z-10
      h-full
      leading-snug
      font-normal
      absolute
      text-center text-gray-400
      absolute
      bg-transparent
      rounded
      text-base
      items-center
      justify-center
      w-8
      pl-3
      py-3
    "
  >
    <i className="fas fa-search"></i>
  </span>
  <input
    type="text"
    placeholder="Search"
    className="
      px-3
      py-3
      placeholder-gray-400
      text-gray-600
      relative
      bg-white bg-white
      rounded
      text-sm
      border border-gray-400
      outline-none
      focus:outline-none focus:ring
      w-full
      pl-10
    "
  />
</div>
    )
}

export default SearchInput