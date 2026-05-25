import { useEffect, useState } from "react";
import axios from "../api/axios";

export const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(url).then((res) => setData(res.data));
  }, [url]);

  return data;
};