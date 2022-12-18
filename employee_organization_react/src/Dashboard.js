import React, { useEffect, useState } from "react";
import EmployeeModal from "./EmployeeModal";
import Tree from "react-d3-tree"
import "./App.css";

const Dashboard = (props) => {

  // employeeData used to show Employees in SideBar
  const [employeeData, setEmployeeData] = useState([]);

  // employeeDataBackup used in the itration part of Filter Function
  const [employeeDataBackup, setEmployeeDataBackup] = useState([]);

  // selectEmployee used to store current selected employee data while clicking on side bar
  const [selectedEmployee, setSelectedEmployee] = useState({});

  // EmployeeModalStatus Responseble for Showing and Hiding the employee detail modal
  // EmployeeModal will show if the value became true otherwise it hides
  const [employeeModalStatus, setemployeeModalStatus] = useState(false);

  // TreeData used in Tree Package, it is responsible for building the tree
  const [treeData, setTreeData] = useState({});



  // This useEffect will Execute when employee data manupulated or updated
  useEffect(() => {
    if (employeeData.length > 0) {
      let findTopLevel = employeeData.find((item) => item.topLevel);

      let data = {
        name: findTopLevel.name,
        attributes: {
          department: findTopLevel.title,
        },
        children: addChildren(findTopLevel.key),
        key: findTopLevel.key,
      };

      console.log("data..", data);

      setTreeData(data);
    }
  }, [employeeData]);


  // useEffect with empty dependency [] will execute once in a page lifecycle
  useEffect(() => {    

    // initiate function will execute once when page loads
    initiate();
  }, []);


  // handleFilter will execute while user typing in the Employee SearchBar
  const handleFilter = (e) => {
    let value = e.target.value;

    let list = employeeDataBackup;

    if (value !== "") {
      let filteredData = list.filter(
        (item) => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
      list = filteredData;
    }

    setEmployeeData(list);
  };

// handleFilter will execute while user click on Employee Name and Tree Node
  const onSelectEmployee = (item) => {
    let bossObj = employeeData.find((itm) => item.parent == itm.key);
    let bossKey = "";
    if (bossObj) {
      bossKey = bossObj.key;
    }

    console.log(
      "Boss..",
      bossKey,
      bossObj,
      employeeData.filter(
        (itm) =>
          item.key !== itm.parent &&
          itm.key !== item.key &&
          item.parent !== undefined
      )
    );

    
    setSelectedEmployee({
      ...item,
      headList: employeeData.filter(
        (itm) => item.key !== itm.parent && itm.key !== item.key
      ),
      bossKey: bossKey,
    });

    setemployeeModalStatus(true);
  };

  const addChildren = (parentId) => {
    let childrenData = employeeData.filter((item) => item.parent == parentId);

    console.log("addChildren...", childrenData, parentId);

    let tmpChildrenData = childrenData.map((itm) => {
      return {
        name: itm.name,
        attributes: {
          department: itm.title,
        },
        children: addChildren(itm.key),
        key: itm.key,
      };
    });

    return tmpChildrenData;
  };


  // For Tree Node 
  const getDynamicPathClass = ({ source, target }, orientation) => {
    if (!target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return "link__to-leaf";
    }

    // Style it as a link connecting two branch nodes by default.
    return "link__to-branch";
  };


  // Called in the UseEffect
  const initiate = () => {

    // To get the employee data from the Server & Stored in the EmployeeData and EmployeeDataBackup
    fetch("http://localhost:4500/getEmployees")
      .then((res) => res.json())
      .then((json) => {
        console.log("json..", json);
        setEmployeeData(json.employees);
        setEmployeeDataBackup(json.employees);
      });
  };

  // Execute while click on submit in the Employee Modal
  const handleSaveChangesModal = (ChangedObj) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: ChangedObj.key,
        title: ChangedObj.title,
        bossKey: ChangedObj.bossKey,
        name: ChangedObj.name,
      }),
    };

    //  To send update employee detail to Server
    fetch("http://localhost:4500/updateEmployee", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        console.log("json..", json);
        setEmployeeData(json.employees);
        setEmployeeDataBackup(json.employees);
      });
  };


  // For Customized Tree Node
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <g>
      <circle
        fill={"#562f4a"}
        r={15}
        stroke={"#cdb4db"}
        onClick={() => {
          let findEmployee = employeeData.find(
            (itr) => itr.key == nodeDatum.key
          );
          onSelectEmployee(findEmployee);
        }}
      ></circle>
      {/* `foreignObject` requires width & height to be explicitly set. */}
      <foreignObject {...foreignObjectProps}>
        <div
          onClick={() => {
            let findEmployee = employeeData.find(
              (itr) => itr.key == nodeDatum.key
            );
            onSelectEmployee(findEmployee);
          }}
          style={{
            border: "1px solid #b56576",
            backgroundColor: "#b56576",
            width: 100,
          }}
        >
          <h5 style={{ textAlign: "center", color: "#FFFFFF", borderWidth: 0 }}>
            {nodeDatum.name}
          </h5>
          {nodeDatum.children && (
            <button
              style={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                border: "0px solid black",
              }}
              onClick={toggleNode}
            >
              {/* {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"} */}
              {nodeDatum.attributes.department}
            </button>
          )}
        </div>
      </foreignObject>
    </g>
  );

  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };

  return (
    <div className="row">
      <nav
        id="sidebarMenu"
        className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
      >
        <div className="position-sticky pt-3 sidebar-sticky">
          <ul className="nav flex-column">
            <div class="form-group">
              <label for="exampleFormControlInput1" style={{
                color:"#b56576",
                fontWeight:'bold'
              }}>Search Employee</label>
              <input
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
                placeholder="Enter Employee Name"
                onChange={(val) => {
                  handleFilter(val);
                }}
              />
            </div>

            {employeeData.map((item) => {
              return (
                <li
                  className="nav-item "
                  style={{
                    height: 70,
                    // paddingTop:10,
                    // borderBottomWidth:1
                  }}
                >
                  <a
                    className="nav-link "
                    onClick={() => {
                      onSelectEmployee(item);
                    }}
                    style={{
                      fontSize: 18,
                      color:"#b56576",
                      fontWeight:'bold'
                    }}
                    href
                  >
                    <span
                      data-feather="file-text"
                      className="align-text-bottom "
                    ></span>
                    {item.name}
                    <br />
                    <div
                      style={{
                        fontSize: 15,
                        color:"#16a085",
                        fontWeight:'normal'
                      }}
                    >
                      {item.title}
                    </div>
                    <hr />
                  </a>
                
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <EmployeeModal
        show={employeeModalStatus}
        data={selectedEmployee}
        handleSaveChangesModal={handleSaveChangesModal}
        onClose={() => {
          setemployeeModalStatus(false);
        }}
      />

      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom" style={{
          backgroundColor:"#b56576"
        }}>
          <h1 className="h2" style={{
            color:'#FFFFFF'
          }}>Employee Organization Chart</h1>
          <div className="btn-toolbar mb-2 mb-md-0"></div>
        </div>

        <div id="treeWrapper" style={{ width: "100em", height: "100em" }}>
          <Tree
            // data={orgChart}
            data={treeData}
            orientation={"vertical"}
            // Passing `straight` function as a custom `PathFunction`.
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
            pathClassFunc={getDynamicPathClass}
            collapsible={false}
            onNodeClick={(item) => {
              console.log("onNodeClick", item.data.key);
              let findEmployee = employeeData.find(
                (itr) => itr.key == item.data.key
              );
              onSelectEmployee(findEmployee);
            }}
            // renderCustomNodeElement={renderRectSvgNode}
            renderCustomNodeElement={(rd3tProps) =>
              renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
            }
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
