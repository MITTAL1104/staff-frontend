import { useEffect, useState } from "react";
import { createData, fetchEmpNameByEmail, fetchUserDetails } from "../../api/api";
import "../../styles/create.css";
import { toast } from "react-toastify";

const CreateAllocation = () => {
  const [formData, setFormData] = useState({
    assigneeName: "",
    projectName: "",
    allocationStartDate: "",
    allocationEndDate: "",
    allocatorName: "",
    percentageAllocation: 100,
    isActive: true,
  });

  const [allocatorName, setAllocatorName] = useState("");

  useEffect(() => {
    const fetchAllocatorName = async () => {
      try {
        const userResponse = await fetchUserDetails(); // gets user info from cookie
        if (userResponse?.data?.email) {
          const email = userResponse.data.email;
          const name = await fetchEmpNameByEmail("employee", email);

          if (name) {
            setAllocatorName(name);
            setFormData((prevData) => ({
              ...prevData,
              allocatorName: name,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch allocator name:", error);
      }
    };

    fetchAllocatorName();
  }, []);

  const showMessage = (message, isError = false) => {
    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      let newValue = type === "checkbox" ? checked : value;

      if (name === "allocationEndDate" && prevData.allocationStartDate) {
        if (newValue < prevData.allocationStartDate) {
          showMessage("End Date cannot be before Start Date!", true);
          return prevData;
        }
      }

      if (
        name === "allocationStartDate" &&
        prevData.allocationEndDate &&
        prevData.allocationEndDate < value
      ) {
        return { ...prevData, [name]: value, allocationEndDate: "" };
      }

      return { ...prevData, [name]: newValue };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createData("allocation", formData);

      if (response) {
        showMessage("Allocation created successfully!");
        setFormData({
          assigneeName: "",
          projectName: "",
          allocationStartDate: "",
          allocationEndDate: "",
          allocatorName: allocatorName, // Keep allocatorName pre-filled after submit
          percentageAllocation: 100,
          isActive: true,
        });
      } else {
        showMessage(
          response?.data?.message || "Failed to create allocation",
          true
        );
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        showMessage(` ${data}` || "An error occurred", true);
      } else {
        showMessage("Network error. Please try again.", true);
      }
    }
  };

  return (
    <div className="create-container">
      <h2>Create Allocation</h2>
      <form onSubmit={handleSubmit}>
        <label>Employee Name</label>
        <input
          type="text"
          name="assigneeName"
          placeholder="Enter Employee Name"
          value={formData.assigneeName}
          onChange={handleChange}
          required
        />
        <label>Project Name</label>
        <input
          type="text"
          name="projectName"
          placeholder="Enter Project Name"
          value={formData.projectName}
          onChange={handleChange}
          required
        />
        <label>Allocation Start Date</label>
        <input
          type="date"
          name="allocationStartDate"
          placeholder="Enter Allocation Start Date"
          value={formData.allocationStartDate}
          onChange={handleChange}
          required
        />
        <label>Allocation End Date</label>
        <input
          type="date"
          name="allocationEndDate"
          placeholder="Enter Allocation End Date"
          value={formData.allocationEndDate}
          onChange={handleChange}
          required
          disabled={!formData.allocationStartDate}
          min={formData.allocationStartDate || ""}
        />
        <label>Allocator Name</label>
        <input
          type="text"
          name="allocatorName"
          placeholder="Enter Allocator Name"
          value={allocatorName}
          onChange={handleChange}
          required
          readOnly // allocator name should not be editable
        />
        <label>% Allocation</label>
        <input
          type="text"
          name="percentageAllocation"
          placeholder="Enter Allocation Percentage"
          value={formData.percentageAllocation}
          onChange={handleChange}
          readOnly
        />
        <div className="checkbox-container">
          <div className="checkbox-item">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label>Active</label>
          </div>
        </div>
        <button type="submit">Create Allocation</button>
      </form>
    </div>
  );
};

export default CreateAllocation;
