import { useState } from "react";
import { deleteDataByID, deleteDataByName, fetchById, fetchByNameForUpdate } from "../../api/api";
import "../../styles/delete2.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DeleteProject = () => {
  const [filterType, setFilterType] = useState("byName");
  const [inputId, setInputId] = useState("");
  const [name, setName] = useState("");

  const showMessage = (message, isError = false) => {
    isError ? toast.error(message) : toast.success(message);
  };

  const handlePreviewDelete = async () => {
    if ((filterType === "byId" && !inputId) || (filterType === "byName" && !name)) {
      showMessage("Please fill the required field", true);
      return;
    }

    try {
      let data;
      if (filterType === "byId") {
        data = await fetchById("project", inputId);
      } else if (filterType === "byName") {
        data = await fetchByNameForUpdate("project", name);
      }

      if (!data || Object.keys(data).length === 0) {
        showMessage(`No Project found for preview`, true);
        return;
      }

      // Determine the data fields based on entity type
      let entityDetails = "";

        entityDetails = `
          <strong>Project ID:</strong> ${data.projectId || "N/A"} <br>
          <strong>Project Name:</strong> ${data.projectName || "N/A"} <br>
          <strong>Description:</strong> ${data.description || "N/A"} <br>
          <strong>Project Owner:</strong> ${data.projectOwnerId || "N/A"} <br>
          <strong>Start Date:</strong> ${data.startDate || "N/A"} <br>
          <strong>End Date:</strong> ${data.endDate || "N/A"} <br>
          <strong>Status:</strong> ${data.isActive ? "Active" : "Inactive"} <br>
        `;
      
      // Show confirmation popup before deleting
      Swal.fire({
        title: `Confirm Delete Project`,
        html: `
          <div class="del-preview-box">
            ${entityDetails}
          </div>
          <p class="del-confirm-warning">
            Are you sure you want to delete this Project?
          </p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleDelete();
        }
      });

    } catch (err) {
      showMessage("Failed to fetch data for preview", true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = 
        filterType === "byId"
          ? await deleteDataByID("project",inputId)
          : await deleteDataByName("project",name);

      if (!response) {
        throw new Error(`No Project found to delete!`);
      }

      showMessage(`Project deleted successfully`);

      // Reset input fields
      setInputId("");
      setName("");
      setFilterType("byName");

    } catch (error) {
      const msg = error?.response?.data || "Network error. Please try again.";
      showMessage(msg, true);
    }
  };

  const handleInputIdChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputId(value);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
    }
  };

  return (
    <div className="del-container">
      <h2 className="del-title">Delete Existing Project</h2>

      <div className="del-options">
        <label>
          <input
            type="radio"
            name="filterType"
            value="byName"
            checked={filterType === "byName"}
            onChange={() => setFilterType("byName")}
          />
          Delete By Name
        </label>

        <label>
          <input
            type="radio"
            name="filterType"
            value="byId"
            checked={filterType === "byId"}
            onChange={() => setFilterType("byId")}
          />
          Delete By ID
        </label>
      </div>

      <div className="del-input">
        {filterType === "byId" ? (
          <input
            type="text"
            placeholder="Enter Project ID"
            value={inputId}
            onChange={handleInputIdChange}
          />
        ) : (
          <input
            type="text"
            placeholder="Enter Project Name"
            value={name}
            onChange={handleNameChange}
          />
        )}


      <button
        className={`del-button ${
          (filterType === "byId" && !inputId) ||
          (filterType === "byName" && !name)
            ? "disabled"
            : ""
        }`}
        onClick={handlePreviewDelete}
        disabled={
          (filterType === "byId" && !inputId) ||
          (filterType === "byName" && !name)
        }
      >
        Delete
      </button>
      </div>
    </div>
  );
};

export default DeleteProject;
