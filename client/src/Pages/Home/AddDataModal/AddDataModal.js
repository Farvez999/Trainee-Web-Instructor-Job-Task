import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddDataModal = ({handleClose,show, handleSubmit, handleAddBilling, errors, register }) => {
    return (
        <div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Add your Billing</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(handleAddBilling)}>
            <Form.Group className="my-3 mx-3">
                <Form.Control name='name' type="text" defaultValue={null} placeholder="Full Name" {...register("name", { required: "Name is required" })} />
            </Form.Group>

            <Form.Group className="my-3 mx-3" controlId="formBasicEmail">
                <Form.Control name='email' type="email" placeholder="Enter email" {...register("email", { required: "Email Address is required" })} />
                {errors.email && <p className='text-red-500' role="alert">{errors.email?.message}</p>}
            </Form.Group>

            <Form.Group className="my-3 mx-3">
                <Form.Control name='phone' type="phone" defaultValue={null} placeholder="Phone Number" {...register("phone", { required: "Phone Numer is required", minLength: { value: 11, message: "At last provide 11 characters" }, maxLength: { value: 11, message: "At last provide 11 characters" } })} />
                {errors.phone && <p className='text-danger' role="alert">{errors.phone?.message}</p>}
            </Form.Group>

            <Form.Group className="my-3 mx-3">
                <Form.Control name='amount' type="text" defaultValue={null} placeholder="Payable Amount" {...register("amount", { required: "Payable Amount is required" })} />
            </Form.Group>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
        </div>
    );
};

export default AddDataModal;