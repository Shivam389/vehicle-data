import React, {useEffect, useState} from 'react';
import './App.css';
import {faker} from '@faker-js/faker';
import BarChart from 'react-bar-chart';
import PaginatedItems from "./PaginatedItems";
import Collapsible from "react-collapsible";
import {PieChart, pieChartDefaultProps} from "react-minimal-pie-chart";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

const margin = {top: 50, right: 50, bottom: 100, left: 60};

function App(){  
  const [data, setData] = useState([]);
  const [perPage, setPerPage]=useState(2);         //for pagination
  const [filteredData, setFilteredData]= useState(data);

  const cache = React.useRef(                      //for user list virtualizer
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 150,
    })
  );

  useEffect(()=>{                                 //Generate fake data
    setData(
      [...Array(100).keys()].map((key) => {
        return {
          ID : key,
          Username : faker.internet.userName(),
          Address : faker.address.country(),
          Age : faker.datatype.number({min:18,max:100}),
          CarMaker : faker.vehicle.manufacturer(),
          CarModel : faker.vehicle.model(),
          CarAge : faker.datatype.number({max:15})
        }
      })
    )
  }, []);

  useEffect(()=>{
    setPerPage(10);
  },[]);
  
  var withuser=[];                                //unique cars for pagination
  var uniqueModels = [...new Set(data.map(item => item.CarModel))];
  
  for(let i in uniqueModels){                     //unique cars with their users
    withuser.push({model:uniqueModels[i], users:data.filter(user=>user.CarModel==uniqueModels[i])})
  }
                                                  //number of users for each country
  var userData = data.reduce( (acc, o) => (acc[o.Address] = (acc[o.Address] || 0)+1, acc), {} );
  
  const barData = [];                             //converting user data in bar chart input format
  Object.keys(userData).forEach(key => barData.push({
   text: key,
   value: userData[key]
  }));
 
  
  //filters for pie charts
  function resetFilter(){
    document.getElementById("reset").style.backgroundColor="rgb(214, 214, 214)";
    document.getElementById("first").style.backgroundColor="white";
    document.getElementById("second").style.backgroundColor="white";
    document.getElementById("third").style.backgroundColor="white";
    document.getElementById("fourth").style.backgroundColor="white";
    setFilteredData(data);
  }
  function firstFilter(){
    document.getElementById("reset").style.backgroundColor="white";
    document.getElementById("first").style.backgroundColor="rgb(214, 214, 214)";
    document.getElementById("second").style.backgroundColor="white";
    document.getElementById("third").style.backgroundColor="white";
    document.getElementById("fourth").style.backgroundColor="white";
    setFilteredData(data.filter(user => (user.Age >= 18 && user.Age<25)));
  }
  function secondFilter(){
    document.getElementById("reset").style.backgroundColor="white";
    document.getElementById("first").style.backgroundColor="white";
    document.getElementById("second").style.backgroundColor="rgb(214, 214, 214)";
    document.getElementById("third").style.backgroundColor="white";
    document.getElementById("fourth").style.backgroundColor="white";
    setFilteredData(data.filter(user => (user.Age >= 25 && user.Age<40)));
  }
  function thirdFilter(){
    document.getElementById("reset").style.backgroundColor="white";
    document.getElementById("first").style.backgroundColor="white";
    document.getElementById("second").style.backgroundColor="white";
    document.getElementById("third").style.backgroundColor="rgb(214, 214, 214)";
    document.getElementById("fourth").style.backgroundColor="white";
    setFilteredData(data.filter(user => (user.Age >= 40 && user.Age<55)));
  }
  function fourthFilter(){
    document.getElementById("reset").style.backgroundColor="white";
    document.getElementById("first").style.backgroundColor="white";
    document.getElementById("second").style.backgroundColor="white";
    document.getElementById("third").style.backgroundColor="white";
    document.getElementById("fourth").style.backgroundColor="rgb(214, 214, 214)";
    setFilteredData(data.filter(user => (user.Age >= 55)));
  }
  //filters for pie charts
  const defaultLabelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };
                                                        //Age of Cars in use for pie chart
  var carAgeData = filteredData.reduce( (acc, o) => (acc[o.CarAge] = (acc[o.CarAge] || 0)+1, acc), {} );
 
  const carAgePieData = [];                             //converting carAge data in pie chart input format
  Object.keys(carAgeData).forEach(key => carAgePieData.push({
   text: key,
   value: carAgeData[key],
   color: "#" +Math.floor(Math.random()*16777215).toString(16)
  }));

  var withModels=[];                                    
  var carMakerData = [...new Set(filteredData.map(item => item.CarMaker))];
  for(let i in carMakerData){                           //unique car makers with their users
    withModels.push({maker:carMakerData[i], models:filteredData.filter(user=>user.CarMaker==carMakerData[i])})
  }

  const carMakerPieData = [];                     //converting carMaker data in pie chart input format
  Object.keys(withModels).forEach(key => carMakerPieData.push({
   text: withModels[key].maker,
   value: withModels[key].models.length,
   color: "#" +Math.floor(Math.random()*16777215).toString(16)
  }));

  function showData(){                           //Toggle between two windows
    document.getElementById("global-data").style.display = "block";
    document.getElementById("car-models").style.display = "none";
  }
  function showCars(){
    document.getElementById("global-data").style.display = "none";
    document.getElementById("car-models").style.display = "block";    
  }
  return (
     <div className="main">                      
       <header className='main-header'>         
         <h1>Global Vehicle Database</h1>
       </header>
       
       <div className='user-sidebar'>
        <header className='sidebar-header'>
          <h2>User Information</h2>
        </header>
        <div className='data-div'>
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowHeight={cache.current.rowHeight}
              deferredMeasurementCache={cache.current}
              rowCount={data.length}
              rowRenderer={({ key, index, style, parent }) => {
                const user = data[index];

                return (
                  <CellMeasurer
                    key={key}
                    cache={cache.current}
                    parent={parent}
                    columnIndex={0}
                    rowIndex={index}
                  >
                    <div className="user-div" style={style}>
                    <Collapsible trigger={user.Username}>
                          <div>
                            <ul>
                              <li>Address:{user.Address}</li>
                              <li>Age:{user.Age}</li>
                              <li>CarAge:{user.CarAge}</li>
                              <li>CarMaker:{user.CarMaker}</li>
                              <li>CarModel:{user.CarModel}</li>
                          </ul>
                          </div>
                    </Collapsible>
                    </div>
                  </CellMeasurer>
                );
              }}
            />
          )}
        </AutoSizer>
        </div>
       </div>

       <div className='information'>
        <header className='info-header'>
          <div id="data-button" className="button" onClick={showData}>Global Data</div>
          <div id="model-button" className="button" onClick={showCars}>Car Models</div>
        </header>

        <div id="global-data">
          <div id="bar-chart">
            <h3>Bar chart with number of user for each country.</h3>
            <BarChart 
                ylabel="Users"
                width={900}
                margin={margin}
                height={400}
                data={barData}
            />
          </div>
          <div id="pie-charts-section">
            <div id="filter">
              <div>User's Age:</div>
              <div className='options' id="reset" onClick={resetFilter}>Any Age</div>
              <div className='options' id="first" onClick={firstFilter}>18-25</div>
              <div className='options' id="second" onClick={secondFilter}>25-40</div>
              <div className='options' id="third" onClick={thirdFilter}>40-55</div>
              <div className='options' id="fourth" onClick={fourthFilter}>55+</div>
            </div>
            <div id="pie-charts">
              <div>
                <h3>Pie chart for age of cars in use</h3>
                  <div id="pie">
                    <PieChart
                      data={carAgePieData}
                      radius={pieChartDefaultProps.radius}
                      label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                      labelStyle={defaultLabelStyle}
                    />
                    <div className="legend">
                      <ul id="pie-list">
                        {carAgePieData.map(user => (
                            <li style={{color: user.color, padding:"0 10px"}}>{user.text} Years</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                <h3>Pie chart for car manufacturers around globe</h3>
                  <div id="pie">
                    <PieChart
                      data={carMakerPieData}
                      radius={pieChartDefaultProps.radius}
                      label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                      labelStyle={defaultLabelStyle}
                    />
                    <div className="legend">
                      <ul id="pie-list">
                        {carMakerPieData.map(user => (
                            <li style={{color: user.color, padding:"0 10px"}}>{user.text}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div id="car-models">
          <h3 id="model-head">Car Models in use over the globe</h3>
          <PaginatedItems itemsPerPage={perPage} 
                          items={withuser}/>
        </div>
       </div>
     </div>
  );  
}

export default App;
