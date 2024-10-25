import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChargingSchedule = ({ vehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [chargingTime, setChargingTime] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/chargingSchedule')
      .then(response => response.json())
      .then(data => setSchedules(data))
      .catch(error => console.error('Error fetching charging schedules:', error));
  }, []);

  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);

    const vehicle = vehicles.find(v => v.id === vehicleId);
    setVehicleDetails(vehicle || null);
  };

  const scheduleCharging = async (vehicleId, time) => {
    const response = await fetch('http://localhost:5000/chargingSchedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId, scheduledTime: time }),
    });
    const newSchedule = await response.json();
    setSchedules([...schedules, newSchedule]);
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if (selectedVehicle && chargingTime) {
      scheduleCharging(selectedVehicle, chargingTime);
      setSelectedVehicle('');
      setChargingTime('');
      setVehicleDetails(null);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Charging Schedule</h2>
        
        <form onSubmit={handleSchedule} className="mb-4">
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="vehicleSelect">Select Vehicle</label>
              <select 
                id="vehicleSelect"
                className="form-control"
                value={selectedVehicle} 
                onChange={handleVehicleChange}
              >
                <option value="">Choose...</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="chargingTime">Charging Time</label>
              <input
                type="time"
                id="chargingTime"
                className="form-control"
                value={chargingTime}
                onChange={(e) => setChargingTime(e.target.value)}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block">Schedule Charging</button>
        </form>

        {vehicleDetails && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Vehicle Details</h5>
              <p className="card-text"><strong>ID:</strong> {vehicleDetails.id}</p>
              <p className="card-text"><strong>Battery:</strong> {vehicleDetails.battery ? vehicleDetails.battery + '%' : 'N/A'}</p>
              <p className="card-text"><strong>Distance:</strong> {vehicleDetails.distanceTravelled ? vehicleDetails.distanceTravelled + ' km' : 'N/A'}</p>
              <p className="card-text"><strong>Last Charge:</strong> {vehicleDetails.lastChargeTime ? new Date(vehicleDetails.lastChargeTime).toLocaleString() : 'N/A'}</p>
              <p className="card-text"><strong>Status:</strong> {vehicleDetails.status || 'N/A'}</p>
            </div>
          </div>
        )}

        {schedules.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Vehicle ID</th>
                  <th>Scheduled Time</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(schedule => (
                  <tr key={schedule.id}>
                    <td>{schedule.vehicleId}</td>
                    <td>{schedule.scheduledTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargingSchedule;
