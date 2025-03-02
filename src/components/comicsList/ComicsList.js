import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMarvelService from "../../services/MarvelService";
import "./comicsList.scss";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
      break;
    case "loading":
      return newItemLoading ? (
        <Component />
      ) : (
        <Spinner />
      ); /* создали отдельную функцию, потому что наш компонент работает немножко иначе из-за наличия newItemLoading  */
      break;
    case "confirmed":
      return <Component />;
      break;
    case "error":
      return <ErrorMessage />;
      break;
  }
};

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [offset, setOffset] = useState(1);
  const [comicsEnded, setComicsEnded] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);

  const { getAllComics, loading, error, clearError, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    updateComicsList(offset, true);
  }, []);

  const updateComicsList = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicsListLoaded)
      .then(() => setProcess("confirmed"));
    clearError();
  };

  const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList.length < 8) {
      ended = true;
    }

    setComicsList((comicsList) => [...comicsList, ...newComicsList]);
    setNewItemLoading(true);
    setOffset((offset) => offset + 9);
    setComicsEnded(ended);
  };

  function renderComicsList(comicsList) {
    const items = comicsList.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li className="comics__item" tabIndex={0} key={i}>
          <Link to={`/comics/${item.id}`}>
            <img
              src={item.thumbnail}
              alt={item.name}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </Link>
        </li>
      );
    });
    return <ul className="comics__grid">{items}</ul>;
  }

  return (
    <div className="comics__list">
      {setContent(process, () => renderComicsList(comicsList), newItemLoading)}
      <button
        className="button button__main button__long"
        style={{ display: comicsEnded ? "none" : "block" }}
      >
        <div className="inner" onClick={() => updateComicsList(offset)}>
          load more
        </div>
      </button>
    </div>
  );
};

export default ComicsList;
