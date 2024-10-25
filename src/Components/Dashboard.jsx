import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import VehicleManagement from './VehicleManagement';
import RealTimeStatus from './RealTimeStatus';
import BatteryAlerts from './BatteryAlerts';
import FleetOverviewDashboard from './FleetOverviewDashboard';
import ChargingSchedule from './ChargingSchedule';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [chargingSchedules, setChargingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles data');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        setError('Error fetching vehicles: ' + error.message);
      }
    };

    const fetchChargingSchedules = async () => {
      try {
        const response = await fetch('http://localhost:5000/chargingSchedule');
        if (!response.ok) throw new Error('Failed to fetch charging schedules');
        const data = await response.json();
        setChargingSchedules(data);
      } catch (error) {
        setError('Error fetching charging schedules: ' + error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchVehicles(), fetchChargingSchedules()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="container my-5">
      {loading && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Vehicle Management</h5>
                <VehicleManagement vehicles={vehicles} setVehicles={setVehicles} />
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Fleet Overview</h5>
                <FleetOverviewDashboard vehicles={vehicles} />
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Real-Time Status</h5>
                <RealTimeStatus vehicles={vehicles} />
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Battery Alerts</h5>
                <BatteryAlerts vehicles={vehicles} />
              </div>
            </div>
          </div>

          <div className="col-lg-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Charging Schedule</h5>
                <ChargingSchedule vehicles={vehicles} chargingSchedules={chargingSchedules} setVehicles={setVehicles} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
