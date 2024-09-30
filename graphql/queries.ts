import { gql } from '@apollo/client';

export const GET_EARTHQUAKES = gql`
  query GetEarthquakes($limit: Int, $offset: Int) {
    earthquakes(limit: $limit, offset: $offset) {
      id
      location
      magnitude
      date
    }
  }
`;
