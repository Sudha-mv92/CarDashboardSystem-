import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RealTimeStatus = ({ vehicles, setVehicles }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === "In Transit" && vehicle.battery > 0) {
            return { ...vehicle, battery: vehicle.battery - 1 };
          }
          if (vehicle.status === "Charging" && vehicle.battery < 100) {
            return { ...vehicle, battery: vehicle.battery + 10 };
          }
          return vehicle;
        })
      );
    }, 600000); // every 10 minutes for charging simulation
    return () => clearInterval(interval);
  }, [setVehicles]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4 className="card-title text-center">Real-Time Status</h4>
        
        <ul className="list-group list-group-flush">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Vehicle ID: {vehicle.vehicleID}</h6>
                <span className={`badge ${vehicle.status === "In Transit" ? "bg-warning" : "bg-success"}`}>
                  {vehicle.status}
                </span>
              </div>
              
              {/* Battery Progress Bar */}
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className={`progress-bar ${vehicle.battery < 20 ? 'bg-danger' : 'bg-primary'}`}
                  role="progressbar"
                  style={{ width: `${vehicle.battery}%` }}
                  aria-valuenow={vehicle.battery}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              
              {/* Battery Level Text */}
              <small className="text-muted">Battery Level: {vehicle.battery}%</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeStatus;
