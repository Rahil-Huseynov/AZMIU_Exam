import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const azmiu = createApi({
    reducerPath: "azmiu",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://assignment-6fdaf-default-rtdb.firebaseio.com/",
    }),
    endpoints: (builder) => ({
        getazmiu: builder.query({
            query: () => `orders.json`,
        }),
    }),
});

export const { useGetazmiuQuery } = azmiu;
