import {
  useCallback,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

const useFetch = (
  url,
  options = {}
) => {
  const {
    enabled = true,
    initialData = [],
  } = options;

  const [data, setData] =
    useState(initialData);

  const [loading, setLoading] =
    useState(enabled);

  const [error, setError] =
    useState(null);

  const fetchData = useCallback(
    async () => {
      if (!url || !enabled) {
        setLoading(false);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response =
          await API.get(url);

        const responseData =
          response?.data;

        setData(
          responseData ?? initialData
        );

        return responseData;
      } catch (err) {
        console.error(
          "useFetch Error:",
          err
        );

        setError(err);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [
      url,
      enabled,
      initialData,
    ]
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!url || !enabled) {
        if (mounted) {
          setLoading(false);
        }

        return;
      }

      if (mounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const response =
          await API.get(url);

        if (mounted) {
          setData(
            response?.data ??
              initialData
          );
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }

        console.error(
          "useFetch Error:",
          err
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [
    url,
    enabled,
    initialData,
  ]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;