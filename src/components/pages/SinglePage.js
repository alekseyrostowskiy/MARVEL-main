import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/SetContent";

const SinglePage = ({ Component, dataType }) => {
  /* вроде как это компонент высшего порядка */
  const { id } = useParams();
  const [data, setData] = useState(null);

  const { getComic, getCharacter, clearError, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    updateData();
  }, [id]);

  const updateData = () => {
    clearError();

    switch (dataType) {
      case "comic":
        getComic(id)
          .then(setData)
          .then(() => setProcess("confirmed"));
        break;
      case "character":
        getCharacter(id)
          .then(setData)
          .then(() => setProcess("confirmed"));
    }
  };

  return <>{setContent(process, Component, data)}</>;
};

export default SinglePage;
