import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

export default function Preloader(){

    return (<>
        <Modal 
            show={true}
            backdrop="static"
            size="lg"
            centered
        >
            <Modal.Body>
                <div className='d-flex justify-content-center py-5'>
                    <Spinner animation="border"/>
                    <div className='ps-3 fs-4'>Loading...</div>
                </div>
            </Modal.Body>
        </Modal>
    </>);
}