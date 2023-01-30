import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditModal = ({handelEdit, handleSubmit, handEditDataModalClose,EditDataModal, errors, register, item}) => {

    const {name, email, phone, amount} = item;
    console.log(item)
    return (
        <div>
        <Modal show={EditDataModal} onHide={handEditDataModalClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Modal heading</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(handelEdit)}>
            <Form.Group className="my-3 mx-3">
                <Form.Control name='name' type="text" defaultValue={name} placeholder="Full Name" {...register("name", { required: "Name is required" })} />
            </Form.Group>

            <Form.Group className="my-3 mx-3" controlId="formBasicEmail">
                <Form.Control name='email' type="email" defaultValue={email} placeholder="Enter email" {...register("email", { required: "Email Address is required" })} />
                {errors.email && <p className='text-red-500'  role="alert">{errors.email?.message}</p>}
            </Form.Group>

            <Form.Group className="my-3 mx-3">
                <Form.Control name='phone' type="phone" defaultValue={phone} placeholder="Phone Number" {...register("phone", { required: "Phone Numer is required", minLength: { value: 11, message: "At last provide 11 characters" }, maxLength: { value: 11, message: "At last provide 11 characters" } })} />
                {errors.phone && <p className='text-danger' role="alert">{errors.phone?.message}</p>}
            </Form.Group>

            <Form.Group className="my-3 mx-3">
                <Form.Control name='amount' type="text" defaultValue={amount} placeholder="Payable Amount" {...register("amount", { required: "Payable Amount is required" })} />
            </Form.Group>

            <Modal.Footer>
                <Button variant="secondary" onClick={handEditDataModalClose}>
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

export default EditModal;