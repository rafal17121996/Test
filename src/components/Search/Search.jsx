import React, { useContext, useEffect, useState } from "react";
import bemCssModules from "bem-css-modules";
import { default as HomeStyles } from "../Home/Home.module.scss";
import { default as ResultStyles } from "../Result/Result.module.scss";
import { useHistory } from "react-router";
import { StoreContext } from "../../store/StoreProvider";
import axios from "axios";



const Search = () => {
  const [query, setQuery] = useState("");
  const [autocomplete, setAutocomplete] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const { isMobile } = useContext(StoreContext);

  useEffect(() => {
    if (query.length > 2) {
      axios.get(`https://unsplash.com/nautocomplete/${query}`).then((res) => {
        const auto = res.data.autocomplete;
        setAutocomplete(auto);
        setIsOpen(true);
        console.log(auto);
      });
    } else {
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setIsOpen(false);
    }
  };

  const renderIt = (link) =>
    history.push({
      pathname: `/s/${link}`,
    });

  const searchPhotos = async (e) => {
    e.preventDefault();
    renderIt(query);
  };

  let style =
    history.location.pathname == "/"
      ? bemCssModules(HomeStyles)
      : bemCssModules(ResultStyles);
      


  let items = autocomplete.length
    ? autocomplete.map((item) => (
        <li
          onClick={()=>renderIt(item.query)}
          key={item.query}
        >
          {item.query}
        </li>
      ))
    : "Not Found";

  return (
    <>
      <form className={style("form")} onSubmit={searchPhotos}>
        <div className={style("input-container")}>
          <i className="fas fa-search"></i>
          
          <input
            autoComplete="off"
            type="text"
            name="query"
            className={style("input")}
            placeholder={
              isMobile ? "Search" : "Search for free high-resolution photos"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isOpen?<i onClick={()=> setIsOpen(false)}  className="fas fa-times"></i>:null}
          
          <div className={style("autocomplete")}>
            <ul>{isOpen ? items : null}</ul>
          </div>
        </div>
      </form>
    </>
  );
};

export default Search;
