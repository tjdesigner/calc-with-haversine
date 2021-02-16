import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

import { SubmitHandler, FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Input from './components/Input';

import HaversineGeolocation from 'haversine-geolocation';

interface FormData {
  lat1: string;
  long1: string;
  lat2: string;
  long2: string;
}

const App: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [datas, setDatas] = useState({});
  const [distancia, setDistancia] = useState(0);

  const mylocation = useCallback((d: any) => {
    d= datas;
    const points = [
      {
          latitude: d.lat1,
          longitude: d.long1,
      },
      {
          latitude: d.lat2,
          longitude: d.long2 
      }
    ];

    let result = HaversineGeolocation.getDistanceBetween(points[0], points[1]);
    setDistancia(result) 
  },[datas]);
  
  const handleSubmit: SubmitHandler<FormData> = useCallback((data) => {
    mylocation(data)
    setDatas(data)
  }, [mylocation]);

  console.log('A Q U I', {datas});

  useEffect(() => {
    mylocation(distancia);
  }, [distancia, mylocation])

  return (
    <div className="App">
        <h1>Calcule a distância em linha reta entre dois pontos</h1>
        <Form ref={formRef} onSubmit={handleSubmit}>
         <label>Coordenadas da primeira referência</label>
         <p>
          <Input name="lat1" placeholder="Latitude 1"/>
          <Input name="long1" placeholder="Longitude 1"/>
         </p>
         <label>Coordenadas da Segunda referência</label>
          <p>
          <Input name="lat2" placeholder="Latitude 2"/>
          <Input name="long2" placeholder="Longitude 2"/>
          </p>
          <button className="App-link" type="submit">CALCULAR</button>
        </Form>
        { distancia > 0 ? <h2>{distancia.toFixed(2)} Km </h2> : <h2>0 Km</h2>}
    </div>
  );
}

export default App;
