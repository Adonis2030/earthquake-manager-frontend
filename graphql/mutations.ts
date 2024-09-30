import { gql } from '@apollo/client';

export const CREATE_EARTHQUAKE = gql`
  mutation CreateEarthquake($input: EarthquakeInput!) {
    createEarthquake(input: $input) {
      id
      location
      magnitude
      date
    }
  }
`;

export const UPDATE_EARTHQUAKE = gql`
  mutation UpdateEarthquake($id: ID!, $input: EarthquakeInput!) {
    updateEarthquake(id: $id, input: $input) {
      id
      location
      magnitude
      date
    }
  }
`;

export const DELETE_EARTHQUAKE = gql`
  mutation DeleteEarthquake($id: ID!) {
    deleteEarthquake(id: $id) {
      id
      location
      magnitude
      date
    }
  }
`;