import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Select } from "react-bootstrap";

const EmployeeModal = (props) => {


  // to preserve employee data from the props here we are storing
  const [data, setData] = useState({
    name: "",
    title: "",
    headList: [],
    bossKey: "",
    key:""
  });

  // For Switching Layouts - Edit/Non Edit Layout
  const [showType, setShowType] = useState("READ_ONLY");


  // will execute while updating props.show (true/false)

  useEffect(() => {
    if (props.show) {
      setData({
        title: props.data.title,
        name: props.data.name,
        headList: props.data.headList,
        bossKey: props.data.bossKey,
        key:props.data.key
      });
    }else{
      setData({
        title: "",
        name:"",
        headList: [],
        bossKey: "",
        key:""
      });
      setShowType("READ_ONLY")
    }

    console.log("Show..", props.show);
  }, [props.show]);



  // will execute when user enters in the input fields
  const handleChange = (e) => {

    let name = e.target.name
    let value = e.target.value

    setData({
      ...data,
      [name]:value
    })


  }

 
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Employee Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={data.name}
              name={"name"}
              readOnly={showType == "READ_ONLY" ? true : false}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={data.title}
              name={"title"}
              readOnly={showType == "READ_ONLY" ? true : false}
              onChange={handleChange}
            />
          </Form.Group>

          {data.bossKey? <Form.Group className="mb-3">
            <Form.Label>Disabled select menu</Form.Label>
            <Form.Control
              as="select"
              disabled={showType == "READ_ONLY" ? true : false}
              name={"bossKey"}
              value={data.bossKey}
              onChange={handleChange}
            >
              {data.headList.map((itm) => {
                return <option key={itm.key} value={itm.key}>{itm.name}</option>;
              })}
            </Form.Control>
          </Form.Group>: null}

        </Form>
      </Modal.Body>
      <Modal.Footer>
        {showType == "READ_ONLY" ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowType("EDIT");
              }}
            >
              Edit
            </Button>
            <Button variant="primary" onClick={props.onClose}>
              Close
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowType("READ_ONLY");
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={()=>{
              props.handleSaveChangesModal({
                name:data.name,
                title:data.title,
                bossKey:data.bossKey,
                key:data.key
              })
              setShowType("READ_ONLY");
            }}>
              Save Changes
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeModal;
