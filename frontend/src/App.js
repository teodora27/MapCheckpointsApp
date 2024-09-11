import * as React from 'react';
import { useState } from 'react';
import Map, {Popup} from 'react-map-gl';
import {Marker} from 'react-map-gl';
import {Room} from "@material-ui/icons";
import "./App.css";
import axios from "axios";

function App() {
  const [pins,setPins] = useState([]);

  const [viewport, setViewport] = useState({
    latitude: 47,
    longitude: 2,
    zoom: 4,
  });

  React.useEffect(()=>{
    const getPins = async()=>{
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins()
  },[])

  return (
    <div className="App"style={{ width: '50vw', height: '100vh'}}>
      <Map
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11" 
        style={
          { 
            width: '100vw', 
            height: '100vh' 
          }
        }
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onMove={(evt) => setViewport(evt.viewState)}
        //onViewportChange={nextViewport => setViewport(nextViewport)}
      
      >

        {pins.map(p=>(
          
        <>  
          <Marker
          latitude={p.lat} 
          longitude={p.long} 
          //offset={[-3.5 * viewState.latitude,-7 * viewport.zoom]}
          anchor="bottom"
        >
          <Room style={{fontSize:viewport.zoom*6, color: "rgb(222, 49, 99)"}}/> 
        </Marker> 

        <Popup 
          latitude={p.lat}
          longitude={p.long} 
          offset={[2,-20]}
          anchor="left"
          // onClose={() => setShowPopup(false)}
          >
          <div className='card'>
          <label>Name</label>
          <h4 className='name'>{p.name}</h4>
          <label>Description</label>
            <p className='desc'>{p.desc}</p>
          <label>Information: </label>
          <span className='username'>Created by <b>{p.username}</b></span>
          <span className='date'> 1 hour ago</span>
          </div>
      </Popup>

        </>
        ))}

      </Map> 
    </div>
  );
}

export default App;
