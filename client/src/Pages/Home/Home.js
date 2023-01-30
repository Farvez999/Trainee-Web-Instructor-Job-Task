import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Pagination, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import TableBody from './TableBody/TableBody';
import TableHeads from './TableHeads/TableHeads';
import { v1 as uuidv1 } from 'uuid';

const Home = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showEdit, setShowEdit] = useState(false);

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => {
        setShowEdit(true)
        console.log(showEdit);
    };

    const serachRef = useRef();
    const [search, setSearch] = useState('');
    const [searchProfile, setsearchProfile] = useState([]);

    const { register, formState: { errors }, handleSubmit } = useForm();

    const [addItems, setAddItems] = useState(false)
    const [paidAmount, setPaidAmount] = useState(0)
    const [loader, setLoader] = useState(false)



    const handleAddBilling = (data) => {
        const name = data.name;
        const email = data.email;
        const phone = data.phone;
        const amount = data.amount;

        console.log(name, email, phone, amount);

        let myuuid = uuidv1();

        const billing = {
            date: new Date(),
            myuuid,
            name,
            email,
            phone,
            amount
        }

        fetch('http://localhost:5000/api/add-billing', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(billing)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.acknowledged) {
                    // setTreatment(null);
                    handleClose()

                    toast.success('Billing Confrimed')
                    refetch();
                } else {
                    toast.error(data.message)
                }

            })

    }

    // show all items 

    const { data: items = [], refetch, isLoading } = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/api/billing-list?search=${search}`)
            const data = await res.json();
            return data;
        }
    })

    console.log(items);

    const handleSearch = () => {
        setSearch(serachRef.current.value);
        console.log(search);
        refetch()
    };

    // useEffect(() => {
    //     fetch(`http://localhost:5000/api/billing-list`)
    //         .then(res => res.json())
    //         .then(data => console.log(data))
    // })

    // total amount calculation
    useEffect(() => {
        if (items.length) {
            let paidAmount = 0;
            items.map((item) => {
                paidAmount += parseInt(item.amount);
            });

            setPaidAmount(paidAmount);
        }

    }, [items])



    const HandelDelete = (id) => {

        if (window.confirm('Are you sure you want to delete') === true) {
            setLoader(true)

            fetch(`http://localhost:5000/api/delete-billing/${id}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${localStorage.getItem("accessToken")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.deletedCount > 0) {
                        refetch();
                        toast.success(`Deleted successfully`);
                    }
                });

            // fetch(`http://localhost:5000/api/delete-billing/${id}`, {

            //     method: 'DELETE',
            //     headers: {
            //         authorization: `bearer ${localStorage.getItem("accessToken")}`,
            //     },

            // })
            //     .then(res => res.json())
            //     .then(data => {

            //         if (data.deletedCount > 0) {
            //             toast.success('Item deleted successfully.');
            //             setLoader(false);
            //             refetch();
            //         }
            //     })
            //     .catch(err => {
            //         toast.error(err.message);
            //         setLoader(false);
            //         console.log(err.message);
            //     });
        }

    }






    if (isLoading) {
        return (<h1 className='text-5xl text-red text-center'>Loading...</h1>)
    }
    // items.filter(item => item.totalCost)

    return (
        <div className='mt-5' style={{ height: '120vh', width: '100%' }}>
            <div className="">
            </div>
            <div className="mx-auto" style={{ width: '80%' }}>


                <Modal showEdit={showEdit} onHide={handleCloseEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit(handleAddBilling)}>
                        <Form.Group className="my-3 mx-3">
                            <Form.Control name='name' type="text" placeholder="Full Name" {...register("name", { required: "Name is required" })} />
                        </Form.Group>

                        <Form.Group className="my-3 mx-3" controlId="formBasicEmail">
                            <Form.Control name='email' type="email" placeholder="Enter email" {...register("email", { required: "Email Address is required" })} />
                            {errors.email && <p className='text-red-500' role="alert">{errors.email?.message}</p>}
                        </Form.Group>

                        <Form.Group className="my-3 mx-3">
                            <Form.Control name='phone' type="phone" placeholder="Phone Number" {...register("phone", { required: "Phone Numer is required", minLength: { value: 11, message: "At last provide 11 characters" }, maxLength: { value: 11, message: "At last provide 11 characters" } })} />
                            {errors.phone && <p className='text-danger' role="alert">{errors.phone?.message}</p>}
                        </Form.Group>

                        <Form.Group className="my-3 mx-3">
                            <Form.Control name='amount' type="text" placeholder="Payable Amount" {...register("amount", { required: "Payable Amount is required" })} />
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


                <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex flex-column justify-content-end mb-3">
                        <h2 className='text-3xl '>Total Ammount: {paidAmount}</h2>

                    </div>
                    <div>
                        <input ref={serachRef} type="text" /> <Button onClick={handleSearch}>Search</Button>
                    </div>

                    <Button variant="primary" onClick={handleShow}>
                        Add New Bill
                    </Button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add your Billing</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleSubmit(handleAddBilling)}>
                            <Form.Group className="my-3 mx-3">
                                <Form.Control name='name' type="text" placeholder="Full Name" {...register("name", { required: "Name is required" })} />
                            </Form.Group>

                            <Form.Group className="my-3 mx-3" controlId="formBasicEmail">
                                <Form.Control name='email' type="email" placeholder="Enter email" {...register("email", { required: "Email Address is required" })} />
                                {errors.email && <p className='text-red-500' role="alert">{errors.email?.message}</p>}
                            </Form.Group>

                            <Form.Group className="my-3 mx-3">
                                <Form.Control name='phone' type="phone" placeholder="Phone Number" {...register("phone", { required: "Phone Numer is required", minLength: { value: 11, message: "At last provide 11 characters" }, maxLength: { value: 11, message: "At last provide 11 characters" } })} />
                                {errors.phone && <p className='text-danger' role="alert">{errors.phone?.message}</p>}
                            </Form.Group>

                            <Form.Group className="my-3 mx-3">
                                <Form.Control name='amount' type="text" placeholder="Payable Amount" {...register("amount", { required: "Payable Amount is required" })} />
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

                <form onSubmit={handleSubmit}>
                    <Table striped bordered hover>
                        {
                            // Table Header
                        }
                        <TableHeads />
                        <tbody>
                            {
                                items.length > 0 &&

                                items.map((item, i) => <TableBody item={item}
                                    HandelDelete={HandelDelete}
                                    handleShowEdit={handleShowEdit}
                                    items={items}
                                    i={i} key={i} />)
                            },


                            {/* {
                           
                            addItems && <AddItemsField  setAddItems={setAddItems} items={items}/>
                        } */}

                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-end mb-3">

                        {
                            addItems &&
                            <Button variant="primary" className='me-3' type='submit'>Save</Button>
                        }
                    </div>
                </form>



            </div>
            <div>

            </div>
        </div>
    );
};

export default Home;