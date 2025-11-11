
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

import qloc from './locales.gql'
import rtl from './rtl'

export const initStrapi = (uri)=>{
  let client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });

  const getData = async (q, variables)=>{
    // trace(q)

    const query = gql(q)
    
    const result = await client
      .query({
        query,
        variables,
      })
    // trace(result)

    return result.data
  }

  const getLocales = async()=>{
    const res = await getData(qloc)
    return res.i18NLocales?.data?.map(d=>d.attributes).map(({__typename, ...p})=>({...p, rtl:!!rtl[p.code]}))
  }

  return {
    getLocales,
    getData,
  }
}

export default initStrapi