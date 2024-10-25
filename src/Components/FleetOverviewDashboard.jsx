import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FleetOverviewDashboard = ({ vehicles }) => {
  const totalVehicles = vehicles.length;

  // Calculate the average battery percentage
  const averageBattery = totalVehicles > 0 
    ? (vehicles.reduce((acc, vehicle) => acc + vehicle.battery, 0) / totalVehicles).toFixed(2) 
    : 0;

  // Filter vehicles with battery less than 20% and count them
  const lowBatteryVehicles = vehicles.filter(vehicle => vehicle.battery < 20);
  const lowBatteryCount = lowBatteryVehicles.length;

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h3 className="card-title text-center">Fleet Overview</h3>
        <p className="card-text"><strong>Total Vehicles:</strong> {totalVehicles}</p>
        <p className="card-text"><strong>Average Battery:</strong> {averageBattery}%</p>
        <p className="card-text">
          <strong>Vehicles with Battery Less Than 20%:</strong> {lowBatteryCount}
        </p>

        {/* Display details of low battery vehicles */}
        {lowBatteryCount > 0 && (
          <div>
            <h5 className="text-danger">Low Battery Vehicles:</h5>
            <ul className="list-group list-group-flush">
              {lowBatteryVehicles.map(vehicle => (
                <li key={vehicle.id} className="list-group-item bg-warning">
                  <strong>Vehicle ID:</strong> {vehicle.vehicleID} <br />
                  <strong>Battery:</strong> {vehicle.battery}%
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetOverviewDashboard;
