import React, { useEffect, useState } from "react";
import {
  fetchAllNames,
  fetchAllIds,
  fetchByNameForUpdate,
  updateDataById,
  getAllEmpNames,
} from "../../api/api";
import "../../styles/update2.css";
import { toast } from "react-toastify";

const UpdateProject = () => {
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [employees,setEmployees] = useState([]);

  //to check valid project owner name is entered in updation
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getAllEmpNames();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
  
    loadEmployees();
  }, []);

  const showMessage = (message, isError = false) => {
    isError ? toast.error(message) : toast.success(message);
  };

  

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedName(null);

    if(!value.trim()){
      setAllProjects([])
      setDropdownVisible(false);
      return;
    }

    if (/^[a-zA-Z\s]*$/.test(value)) {
      try {
        const [names, ids] = await Promise.all([
          fetchAllNames("project", value),
          fetchAllIds("project", value),
        ]);

        if(names.length===0){
          setDropdownVisible(false);
          setAllProjects([]);
          showMessage("No matching names found",true);
        } else{
          const combined = names.map((name, index) => ({
            name,
            id: ids[index] ?? "N/A",
          }));
          setAllProjects(combined);
          setDropdownVisible(true);
        }

      } catch (error) {
        showMessage("Failed to fetch project list",true);
      }
    }
  };

  const handleDropdownSelect = (selectedName) => {
    setInputValue(selectedName);
    setSelectedName(selectedName);
    setDropdownVisible(false);
  };

  const fetchEmployeeData = async () => {
    if (!selectedName) {
      showMessage("Please select a project from dropdown!", true);
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetchByNameForUpdate("project", selectedName);
      if (response) {
        setFormData(response);
        showMessage("Project data loaded successfully");
        setDropdownVisible(false);
        setInputValue(response.name);
      } else {
        showMessage(`Project '${inputValue}' not found!`, true);
        setFormData(null);
      }
    } catch (error) {
      showMessage("Network error. Please try again!", true);
    }
    setIsFetching(false);
  };

  const handleInputChangeForm = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData?.projectId) {
      showMessage("Invalid project ID!", true);
      return;
    }

    const ownerName = employees.find(
      (ownerName) => ownerName.name === formData.projectOwnerName
    );

    if(!ownerName){
      showMessage("Invalid Project Owner Name",true);
      return;
    }

    const updatedPayLoad = {
      ...formData,
      name:ownerName.name,
    }

    //updation
    try {
      const response = await updateDataById("project", formData.projectId, updatedPayLoad);

      if (response) {
        showMessage("Project updated successfully");
        setFormData(null);
        setInputValue("");
      } else {
        showMessage("Failed to update project", true);
      }
    } catch (error) {
      const msg = error?.response?.data || "Network error. Please try again.";
      showMessage(msg, true);
    }
  };

  const isFormValid =
    formData?.projectName &&
    formData?.description &&
    formData?.projectOwnerName &&
    formData?.startDate &&
    formData?.endDate &&
    formData?.isActive !== undefined;

  return (
    <div className="update-container">
      <h2>Edit Project Details</h2>

      <div className="fetch-section">
        <div className="dropdown-container">
          <input
            type="text"
            placeholder="Enter Project Name"
            value={inputValue}
            onChange={handleInputChange}
          />
          {dropdownVisible && (
            <div className="dropdown">
              {allProjects.map((proj, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleDropdownSelect(proj.name)}
                >
                  {proj.name} (Project ID:{proj.id})
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={fetchEmployeeData}
          disabled={isFetching || !inputValue?.trim()}
          className={`load-btn ${isFetching || !inputValue?.trim()? "disabled-btn" : ""}`}
        >
          {isFetching ? "Fetching..." : "Preview"}
        </button>
      </div>

      {formData && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="projectId">ID</label>
          <input
            type="number"
            name="projectId"
            value={formData.projectId}
            readOnly
          />

          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}  
            onChange={handleInputChangeForm}
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChangeForm}
          />

          <label htmlFor="projectOwnerName">Project Owner</label>
          <input
            type="text"
            name="projectOwnerName"
            value={formData.projectOwnerName}
            onChange={handleInputChangeForm}
          />

          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChangeForm}
          />

          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChangeForm}
          />

          <div className="checkbox-container">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChangeForm}
            />
            <label>Active</label>
          </div>

          <button type="submit" disabled={!isFormValid}>
            Update Project
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateProject;
