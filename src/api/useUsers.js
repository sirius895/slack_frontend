import axios from "axios";
import { useQuery } from "../providers/QueryProvider";

const useUser = () => {
    const { isLoading, data } = useQuery({
        queryKey: 'user',
        queryFn: () => {
            return axios.get(`${process.env.REACT_APP_BASE_URL}/user`);
        }
    });

    return {
        isLoading,
        users: data || [],
    }
}

export default useUser;
