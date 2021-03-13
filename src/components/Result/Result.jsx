import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { createApi } from "unsplash-js";
import bemCssModules from "bem-css-modules";

import { default as ResultStyles } from "../Result/Result.module.scss";
import Search from "../Search/Search";
import CardItem from "./subComponent/CardItem";

const style = bemCssModules(ResultStyles);

const unsplash = createApi({
  accessKey: "QgXvC8fb6nDTrx9Obhni-HRmKvrFf1WCxHQ5q_FitRM",
});

const Result = () => {
  const [pics, setPics] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState();
  const { item } = useParams();

  useEffect(() => {
    unsplash.search
      .getPhotos({
        query: item,
        page: page,
        perPage: 20,
      })
      .then((result) => {
        if (result.errors) {
          console.log("error occurred: ", result.errors[0]);
        } else {
          const photos = result.response.results;
          console.log(photos);
          console.log(result.response);
          setMaxPage(result.response.total_pages);
          setPics(photos);
        }
      });
  }, [item, page]);

  const handlePage = (i) => {
    if (i == -1 && page > 1) {
      setPage(page + i);
    } else if (i == 1 && page < maxPage) {
      setPage(page + i);
    }
  };

  return (
    <section>
      <Search />
      <h1 className={style("title")}>{item.charAt(0).toUpperCase() + item.slice(1)}</h1>
      <div className={style("")}>
        {pics.map((pic) => (
          <CardItem key={pic.id} pic={pic} />
        ))}
      </div>
      <div className={style("page")}>
     
      <i onClick={() => handlePage(-1)} className="fas fa-arrow-left"></i>
      <input
            type="text"
            className={style("input")}
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
      <i onClick={() => handlePage(1)} className="fas fa-arrow-right"></i>
      </div>
    </section>
  );
};
export default Result;
