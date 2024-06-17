import { useState,useEffect } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const[isFetching,setIsFetching] = useState(false);
  const[availabePlaces,setAvailablePlaces] = useState([]);
  const[error,setError] = useState();

  useEffect(()=>{
    async function fetchPlaces(){
        setIsFetching(true);
        try{
          const places = await fetchAvailablePlaces();
          
          navigator.geolocation.getCurrentPosition((position)=>{
            const sortedData = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
            setAvailablePlaces(sortedData);
            setIsFetching(false);
          })

        }catch(error){
          setError({ message:error.message || 'Could not fetch places, Please keep trying' });
          setIsFetching(false);
        }
    }
    
    fetchPlaces();

  },[])

  if(error){
    return <Error title="An Error occurred" message={error.message} />
  }
 
  return (
    <Places
      title="Available Places"
      places={availabePlaces}
      isLoading={isFetching}
      fallbackText="No Places available"
      loadingText="Fetching Data..."
      onSelectPlace={onSelectPlace}
    />
  );
}
