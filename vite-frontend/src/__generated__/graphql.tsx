import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  steri_item?: Maybe<Array<Maybe<Steri_Item>>>;
  steri_item_by_pk?: Maybe<Steri_Item>;
};


export type QuerySteri_Item_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Steri_Item = {
  __typename?: 'steri_item';
  category: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  is_active: Scalars['Boolean']['output'];
  is_count_enabled?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  total_count?: Maybe<Scalars['Int']['output']>;
};

export type ListSteriItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListSteriItemsQuery = { __typename?: 'Query', steri_item?: Array<{ __typename?: 'steri_item', id: number, name: string, category: string, total_count?: number | null, is_active: boolean } | null> | null };


export const ListSteriItemsDocument = gql`
    query listSteriItems {
  steri_item {
    id
    name
    category
    total_count
    is_active
  }
}
    `;

/**
 * __useListSteriItemsQuery__
 *
 * To run a query within a React component, call `useListSteriItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListSteriItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListSteriItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListSteriItemsQuery(baseOptions?: Apollo.QueryHookOptions<ListSteriItemsQuery, ListSteriItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListSteriItemsQuery, ListSteriItemsQueryVariables>(ListSteriItemsDocument, options);
      }
export function useListSteriItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListSteriItemsQuery, ListSteriItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListSteriItemsQuery, ListSteriItemsQueryVariables>(ListSteriItemsDocument, options);
        }
export type ListSteriItemsQueryHookResult = ReturnType<typeof useListSteriItemsQuery>;
export type ListSteriItemsLazyQueryHookResult = ReturnType<typeof useListSteriItemsLazyQuery>;
export type ListSteriItemsQueryResult = Apollo.QueryResult<ListSteriItemsQuery, ListSteriItemsQueryVariables>;