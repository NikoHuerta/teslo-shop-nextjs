import useSWR, { SWRConfiguration } from 'swr';
import { IProduct } from '../interfaces';

// const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());

interface Response {
    ok: boolean;
    products?: IProduct[];
    message: string;


}

export const useProducts = (url: string, config: SWRConfiguration= {} ) => {

    // const { data, error } = useSWR<Response>(`/api${ url }`, fetcher, config );
    const { data, error } = useSWR<Response>(`/api${ url }`, config );


    return {
        products: data?.products || [],
        isLoading: !error && !data,
        isError: error
    }

}