import React, { useCallback, useRef, useState } from 'react';
import './App.css';

import { SubmitHandler, FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Input from './components/Input';

interface FormData {
  lat1: string;
  lon1: string;
  lat2: string;
  lon2: string;
}

const App: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [distancia, setDistancia] = useState('0');

  const haversineFn = (lat1: number, lon1: number, lat2: number, lon2: number) => {

    let la1 = lat1;
    let la2 = lat2;
    let lo1 = lon1;
    let lo2 = lon2;

    const R = 6371e3; // metres
    const φ1 = la1 * Math.PI/180; // φ, λ in radians
    const φ2 = la2 * Math.PI/180;
    const Δφ = (la2-la1) * Math.PI/180;
    const Δλ = (lo2-lo1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return d;
  };

  const mylocation = useCallback((d: any) => {

    d.lat1 = d.latLon1.substring(0, 18);
    d.lon1 = d.latLon1.substring(20, 38);
    d.lat2 = d.latLon2.substring(0, 18);
    d.lon2 = d.latLon2.substring(20, 38);
    
    const result = haversineFn(d.lat1, d.lon1, d.lat2, d.lon2);
    let resCalc = result.toString().substring(0 ,3)
    setDistancia(resCalc);
  },[]);
  
  const handleSubmit: SubmitHandler<FormData> = useCallback((data) => {
    mylocation(data);
  }, [mylocation]);

  return (
    <>
      <div className="App">
          <h2>Calcule a distância em <b>linha reta</b> entre dois pontos</h2>
          <p>
            <code>Busque os pontos através do <a className="google" href="https://www.google.com.br/maps" target="blank">Google Maps</a></code>
          </p>
          <Form ref={formRef} onSubmit={handleSubmit}>
          <label>Insira latitude e longitude de cada ponto</label>
          <p>
            <Input name="latLon1" placeholder="Latitude e Longitude pronto 1"/>
            <Input name="latLon2" placeholder="Longitude e Longitude pronto 2"/>
          </p>
            <button className="App-link" type="submit">CALCULAR</button>
          </Form>
          { distancia !== '0' ? <h2>{distancia} Km </h2> : <h2>0 Km</h2>}
          <code><a className="git" href="https://github.com/tjdesigner/calc-with-haversine" target="blank">GitHub | TJDesigner</a></code>
      </div>
    </>
  );
}

export default App;
