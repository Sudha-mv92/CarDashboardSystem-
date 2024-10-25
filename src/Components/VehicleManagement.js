import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    model: '',
    battery: 100,
    distanceTravelled: 0,
    lastChargeTime: '',
    status: 'Idle',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing vehicles from the server
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/vehicles');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        setError('Error fetching vehicles: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const addVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          battery: Number(formData.battery),
          distanceTravelled: Number(formData.distanceTravelled),
        }),
      });
      if (!response.ok) throw new Error('Failed to add vehicle');
      const newVehicle = await response.json();
      setVehicles([...vehicles, newVehicle]);
      resetForm();
      setSuccessMessage('Vehicle added successfully!');
    } catch (error) {
      setError('Error adding vehicle: ' + error.message);
    }
  };

  const updateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/vehicles/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          battery: Number(formData.battery),
          distanceTravelled: Number(formData.distanceTravelled),
        }),
      });
      if (!response.ok) throw new Error('Failed to update vehicle');
      const updatedVehicle = await response.json();
      setVehicles(vehicles.map(vehicle => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle)));
      resetForm();
      setSuccessMessage('Vehicle updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError('Error updating vehicle: ' + error.message);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/vehicles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete vehicle');
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      setSuccessMessage('Vehicle deleted successfully!');
    } catch (error) {
      setError('Error deleting vehicle: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      model: '',
      battery: 100,
      distanceTravelled: 0,
      lastChargeTime: '',
      status: 'Idle',
    });
    setIsEditing(false);
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setIsEditing(true);
  };

  return (
    <div className="container-fluid mt-5">
      <h1 className="mb-4 text-center">Vehicle Management</h1>
      {loading && <p>Loading vehicles...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={isEditing ? updateVehicle : addVehicle} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="vehicle-id" className="form-label">ID:</label>
            <input
              type="number"
              id="vehicle-id"
              className="form-control"
              name="id"
              placeholder="Vehicle ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
              disabled={isEditing}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="vehicle-model" className="form-label">Model:</label>
            <input
              type="text"
              id="vehicle-model"
              className="form-control"
              name="model"
              placeholder="Vehicle Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="vehicle-battery" className="form-label">Battery Level (%):</label>
            <input
              type="number"
              id="vehicle-battery"
              className="form-control"
              name="battery"
              placeholder="Battery Level"
              value={formData.battery}
              onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="vehicle-distance" className="form-label">Distance (km):</label>
            <input
              type="number"
              id="vehicle-distance"
              className="form-control"
              name="distanceTravelled"
              placeholder="Distance Travelled"
              value={formData.distanceTravelled}
              onChange={(e) => setFormData({ ...formData, distanceTravelled: e.target.value })}
              min="0"
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="vehicle-last-charge" className="form-label">Last Charge Time:</label>
            <input
              type="datetime-local"
              id="vehicle-last-charge"
              className="form-control"
              name="lastChargeTime"
              value={formData.lastChargeTime}
              onChange={(e) => setFormData({ ...formData, lastChargeTime: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="vehicle-status" className="form-label">Status:</label>
            <select
              id="vehicle-status"
              className="form-select"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Idle">Idle</option>
              <option value="In Transit">In Transit</option>
              <option value="Charging">Charging</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary mt-3">
          {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </form>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Model</th>
              <th>Battery (%)</th>
              <th>Distance Travelled (km)</th>
              <th>Last Charge Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.battery}</td>
                <td>{vehicle.distanceTravelled}</td>
                <td>{new Date(vehicle.lastChargeTime).toLocaleString()}</td>
                <td>{vehicle.status}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(vehicle)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteVehicle(vehicle.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleManagement;
