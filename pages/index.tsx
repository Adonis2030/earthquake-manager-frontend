import React, { useState } from 'react';
import EarthquakeList from '../components/EarthquakeList';
import EarthquakeForm from '../components/EarthquakeForm';
import { Container, Typography } from '@mui/material';

const Home = () => {
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [modal, setSelectedModal] = useState(false);

  const handleEdit = (earthquake: React.SetStateAction<null>) => {
    setSelectedModal(!modal)
    setSelectedEarthquake(earthquake);
  };

  const handleCompleted = () => {
    setSelectedEarthquake(null);
  };

  return (
    <Container className='relative flex justify-center items-center'>
      <EarthquakeForm modal={modal} setSelectedModal={setSelectedModal} earthquake={selectedEarthquake} onCompleted={handleCompleted} />
      <EarthquakeList onEdit={handleEdit} modal={modal} setSelectedModal={setSelectedModal}/>
    </Container>
  );
};

export default Home;