import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BatteryAlerts = ({ vehicles }) => {
  const lowBatteryVehicles = vehicles.filter(vehicle => vehicle.battery < 15);
  const warningBatteryVehicles = vehicles.filter(vehicle => vehicle.battery >= 15 && vehicle.battery < 30);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Battery Alerts</h2>
      {lowBatteryVehicles.length > 0 ? (
        lowBatteryVehicles.map(vehicle => (
          <div key={vehicle.id} className="alert alert-danger d-flex align-items-center">
            <span role="img" aria-label="warning" className="mr-2">⚠️</span>
            Vehicle {vehicle.id} has a low battery: {vehicle.battery}%
          </div>
        ))
      ) : (
        <div className="alert alert-success text-center">All vehicles are in good condition!</div>
      )}
      {warningBatteryVehicles.length > 0 && (
        warningBatteryVehicles.map(vehicle => (
          <div key={vehicle.id} className="alert alert-warning d-flex align-items-center">
            <span role="img" aria-label="warning" className="mr-2">⚠️</span>
            Vehicle {vehicle.id} has a warning battery level: {vehicle.battery}%
          </div>
        ))
      )}
    </div>
  );
};

export default BatteryAlerts;
