import React from "react";

function SearchEngine({ query, setQuery, search, changeCity, getCurrentLocationWeather}) {
  return (
    <>
    <div className="SearchEngine">
      <input
        type="text"
        className="city-search"
        placeholder="Enter City Name"
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={search}
      />
      <button onClick={changeCity}><i className="fas fa-search" style={{ fontSize: "18px" }}></i></button>
    </div>
    <button onClick={getCurrentLocationWeather} className="width-fit">Current Location</button>
    </>
  );
}

export default SearchEngine;
