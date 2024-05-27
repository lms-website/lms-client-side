import axios from "axios";
import Cookies from "js-cookie";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./../Utils/helper";

function useGetData(endpoint) {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchData = async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      const response = await axios.get(`${apiKey + endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedData = response.data;

      setData(fetchedData);
    } catch (err) {
      console.error("Error fetching data:", err.message);

      setError(err.response.data.detail);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [endpoint, token]);

  return { data, setData, loading, fetchData, error };
}

export default useGetData;
