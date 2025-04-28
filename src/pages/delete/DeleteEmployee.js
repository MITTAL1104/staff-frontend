import { useState } from "react";
import {
  deleteDataByID,
  deleteDataByName,
  fetchById,
  fetchByNameForUpdate,
} from "../../api/api";
import "../../styles/delete2.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DeleteEmployee = () => {
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
        data = await fetchById("employee", inputId);
      } else {
        data = await fetchByNameForUpdate("employee", name);
      }

      if (!data || Object.keys(data).length === 0) {
        showMessage("No Employee found for preview", true);
        return;
      }

      const entityDetails = `
        <strong>ID:</strong> ${data.employeeId || "N/A"} <br>
        <strong>Name:</strong> ${data.name || "N/A"} <br>
        <strong>Email:</strong> ${data.email || "N/A"} <br>
        <strong>Role:</strong> ${data.roleName || "N/A"} <br>
        <strong>Date of Joining:</strong> ${data.dateOfJoining || "N/A"} <br>
        <strong>Status:</strong> ${data.isActive ? "Active" : "Inactive"} <br>
        <strong>Admin:</strong> ${data.isAdmin ? "Yes" : "No"} <br>
      `;

      Swal.fire({
        title: "Confirm Delete Employee",
        html: `
          <div class="del-preview-box">
            ${entityDetails}
          </div>
          <p class="del-confirm-warning">
            Are you sure you want to delete this employee?
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
  }; //preview data in form of sweet alert

  const handleDelete = async () => {
    //deletion logic
    try {
      const response =
        filterType === "byId"
          ? await deleteDataByID("employee", inputId)
          : await deleteDataByName("employee", name);

      if (!response) throw new Error("No employee found to delete!");

      showMessage("Employee deleted successfully");
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
    if (/^\d*$/.test(value)) setInputId(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) setName(value);
  };

  return (
    <div className="del-container">
      <h2 className="del-title">Delete Existing Employee</h2>

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
            placeholder="Enter Employee ID"
            value={inputId}
            onChange={handleInputIdChange}
          />
        ) : (
          <input
            type="text"
            placeholder="Enter Employee Name"
            value={name}
            onChange={handleNameChange}
          />
        )}
      

      <button
        className={`del-button ${
          (filterType === "byId" && !inputId) || (filterType === "byName" && !name)
            ? "disabled"
            : ""
        }`}
        onClick={handlePreviewDelete}
        disabled={
          (filterType === "byId" && !inputId) || (filterType === "byName" && !name)
        }
      >
        Delete
      </button>
      </div>
    </div>
  );
};

export default DeleteEmployee;
