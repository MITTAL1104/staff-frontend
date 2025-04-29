import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const authorizedRequest = async (method, url, data = null) => {

  try {
    const response = await axios({
      method,
      url,
      data,
      withCredentials:true,
    });
    return response.data;
  } catch (error) {
    console.error("Error in authorized request: ", error);
    throw error;
  }
};

export const downloadExcel = async (fileName = "data", type, value, entity) => {
  const url = new URL(`${baseUrl}/${entity}/downloadExcel`);
  if (type !== undefined) url.searchParams.append("type", type);
  if (value !== undefined) url.searchParams.append("value", value);

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include", // ✅ allow cookies to be sent
    });

    if (!response.ok) throw new Error("Failed to download");

    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed", error);
  }
};


export const userRegister = async (email, password) => {
  try {
    const response = await axios.post(`${baseUrl}/register`, {
      email,
      password,
    });
    return { success: true, message: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response ? error.response.data : "Error registering user",
    };
  }
};

export const userRegisterWithDetails = async (
  email,
  password,
  name,
  role,
  dateOfJoining
) => {
  try {
    const response = await axios.post(`${baseUrl}/registerWithDetails`, {
      email,
      password,
      name,
      role,
      dateOfJoining,
    });
    return { success: true, message: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response
        ? error.response.data
        : "Error registering user with details",
    };
  }
};

export const userLogin = async (email, password) => {
  const response = await axios.post(`${baseUrl}/login`, {
    email,
    password,
  },{withCredentials:true});
  return response.data;
};

export const userLogout = async () => {
  const response = await axios.get(`${baseUrl}/logout`, {
    withCredentials: true, 
  });
  return response.data;
};

export const updatePassword = async(email,oldPassword,newPassword) => {
  return authorizedRequest("post",`${baseUrl}/updatePassword`,{
    email,
    oldPassword,
    newPassword
  })
}

export const fetchUserDetails = async() =>{
  try{
    const response = await axios.get(`${baseUrl}/details`,{
      withCredentials:true,
    });
    return response;
  } catch(error){
    throw error;
  }
}

export const fetchAllData = async (entity) => {
  return authorizedRequest("get", `${baseUrl}/${entity}/getAll`);
};

export const fetchAllActiveData = async (entity) => {
  return authorizedRequest("get", `${baseUrl}/${entity}/getAllActive`);
};

export const fetchById = async (entity, id) => {
  return authorizedRequest("get", `${baseUrl}/${entity}/getById/${id}`);
};

export const fetchAllAllocationData = async () => {
  return authorizedRequest("get", `${baseUrl}/allocation/getAll`);
};

export const fetchAllAllocationByEmployeeName = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getAllocByEmpName/${name}`
  );
};

export const fetchAllocationByEmployeeName = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getByEmpName/${name}`
  );
};

export const fetchByAllocationId = async (id) => {
  return authorizedRequest("get", `${baseUrl}/allocation/getById/${id}`);
};

export const fetchByEmployeeId = async (id) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getByEmpId/${id}`
  );
};

export const fetchByProjectId = async (id) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getByProjId/${id}`
  );
};

export const fetchByName = async (entity, name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/${entity}/getAllByName/${name}`
  );
};

export const fetchByNameForUpdate = async (entity, name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/${entity}/getByName/${name}`
  );
};

export const fetchAllocationByProjectName = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getByProjName/${name}`
  );
};

export const fetchByNameForUpdateAllocation = async (entity, name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/${entity}/getByEmpName/${name}`
  );
};

export const fetchByProjectNameForUpdateAllocation = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/updateByProjName/${name}`
  );
};

export const fetchAllNames = async (entity,name) => {
  return authorizedRequest("get", `${baseUrl}/${entity}/getNames/${name}`);
};

export const getAllEmpNames = async()=> {
  return authorizedRequest("get",`${baseUrl}/employee/getAllNames`);
}

export const fetchAllIds = async (entity, name = "") => {
  return authorizedRequest("get", `${baseUrl}/${entity}/getIds/${name}`);
};

export const fetchAllocIds = async (name = "") => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getAllocIds/${name}`
  );
};

export const fetchAllProjNames = async (entity, name = "") => {
  return authorizedRequest(
    "get",
    `${baseUrl}/${entity}/getProjects/${name}`
  );
};

export const fetchEmpNameByEmail = async (entity, email) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/${entity}/getNameByEmail/${email}`
  );
};

export const fetchIsAdminByEmail = async (email) => {
  return authorizedRequest("get", `${baseUrl}/getIsAdmin/${email}`);
};

export const fetchEmpIdByEmail = async (email) => {
  return authorizedRequest("get", `${baseUrl}/getEmpIdByEmail/${email}`);
};

export const fetchProjIdByEmpId = async (entity, id) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/${entity}/getProjIdByEmpId/${id}`
  );
};

export const fetchEmpIdByName = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getEmpIdByName/${name}`
  );
};

export const fetchProjIdByName = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getProjIdByName/${name}`
  );
};

export const fetchAllocForDeleteByEmpName = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getAllocDelByEmpName/${name}`
  );
};

export const fetchAllocForDeleteByProjName = async (name) => {
  return authorizedRequest(
    "get",
    `${baseUrl}/allocation/getAllocDelByProjName/${name}`
  )
};

export const fetchAllRoles = async()=>{
  return authorizedRequest(
    "get",
    `${baseUrl}/employee/getRoles`
  )
} 

export const createData = async (entity, data) => {
  return authorizedRequest("post", `${baseUrl}/${entity}/add`, data);
};

export const updateDataById = async (entity, id, data) => {
  return authorizedRequest(
    "put",
    `${baseUrl}/${entity}/updateId/${id}`,
    data
  );
};

export const updateAllocByProjId = async (id, data) => {
  return authorizedRequest(
    "put",
    `${baseUrl}/allocation/updateAllocByProjId/${id}`,
    data
  );
};

export const updateDataByName = async (entity, name, data) => {
  return authorizedRequest(
    "put",
    `${baseUrl}/${entity}/updateName/${name}`,
    data
  );
};

export const deleteAllData = async (entity) => {
  return authorizedRequest("delete", `${baseUrl}/${entity}/deleteAll/`);
};

export const deleteDataByID = async (entity, id) => {
  return authorizedRequest(
    "delete",
    `${baseUrl}/${entity}/deleteId/${id}`
  );
};

export const deleteDataByName = async (entity, name) => {
  return authorizedRequest(
    "delete",
    `${baseUrl}/${entity}/deleteName/${name}`
  );
};

export const deleteDataByAllocationID = async (id) => {
  return authorizedRequest(
    "delete",
    `${baseUrl}/allocation/deleteId/${id}`
  );
};

export const deleteDataByEmployeeID = async (id) => {
  return authorizedRequest(
    "delete",
    `${baseUrl}/allocation/deleteEmpId/${id}`
  );
};

export const deleteDataByProjectID = async (id) => {
  return authorizedRequest(
    "delete",
    `${baseUrl}/allocation/deleteProjId/${id}`
  );
};
