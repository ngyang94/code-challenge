import { useState, useEffect , type ReactNode } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function AlertDismissible({children,status,show,close,onClose}:{children:ReactNode,status:string,show:boolean,close:()=>void,onClose:()=>void}) {
  
  useEffect(()=>{
    setTimeout(()=>{
        onClose()
    },3000)
  },[])

  return (
    <>
      <Alert show={show} variant={status=="success"?"success":"danger"} onClose={onClose}>
        <Alert.Heading>{status=="success"?"Success":"Failed"}</Alert.Heading>

        <Row>
            <Col xs={10} md={10} lg={10}>
                {children}
            </Col>
            <Col xs={2} md={2} lg={2} className='justify-content-end'>
                <Button onClick={() => {close();}} variant={status=="success"?"outline-success":"outline-danger"}>
                    Close
                </Button>
            </Col>
        </Row>
      </Alert>

    </>
  );
}

export default AlertDismissible;