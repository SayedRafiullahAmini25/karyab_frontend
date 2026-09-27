import { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";
import { apiPath } from "../configs/conf";
const AppContext = createContext();

export function AppProvider({ children }) {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topWorkers, setTopWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  // const [users, setUsers] = useState([]);

  const getListOfWorkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiPath}/api/v1/worker/list`);
      if (!response.data?.success) {
        setWorkers([]);
        setTopWorkers([]);
        return;
      }
      const data = response.data.data || [];
      setWorkers(data);
      setTopWorkers(data.filter((w) => Number(w.rate) > 0));
    } catch (error) {
      console.log("getListOfWorkers:", error?.response?.data || error.message);
      setWorkers([]);
      setTopWorkers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getListOfJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiPath}/api/v1/job/list`);
      if (!response.data?.success) {
        setJobs([]);
        return;
      }
      setJobs(response.data.data);
    } catch (error) {
      console.log("getListOfJobs:", error?.response?.data || error.message);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // const getListOfUsers = async () => {
  //   const res = await axios.get(`${apiPath}/api/v1/user/list`);
  //   if (!res.data.success) return setWorkers([]);

  //   setUsers(res.data.data);
  // };

  const values = {
    getListOfWorkers,
    workers,
    isLoading,
    topWorkers,
    jobs,
    getListOfJobs,
    // getListOfUsers,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
