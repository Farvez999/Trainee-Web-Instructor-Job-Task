import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Pagination, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import TableBody from './TableBody/TableBody';
import TableHeads from './TableHeads/TableHeads';
import { v1 as uuidv1 } from 'uuid';
import EditModal from './EditModal/EditModal';
import AddDataModal from './AddDataModal/AddDataModal';

const Home = () => {

    const { register, formState: { errors }, handleSubmit } = useForm();

    const [show, setShow] = useState(false);
    const [EditDataModal, setEditDataModal] = useState(false)
    const [item, setItem] = useState({})


    // add modal functions
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // edit modal functions
    const handEditDataModalClose = () => setEditDataModal(false);
    const handEditDataModal = (items) => {
        setEditDataModal(!EditDataModal)
        setItem(items);
    };


    // edit data
    const handelEdit = data => {
        console.log(data);
    }


    const serachRef = useRef();
    const [search, setSearch] = useState('');


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

        fetch('https://server-teal-seven.vercel.app/api/add-billing', {
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
            const res = await fetch(`https://server-teal-seven.vercel.app/api/billing-list?search=${search}`)
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
    //     fetch(`https://server-teal-seven.vercel.app/api/billing-list`)
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

            fetch(`https://server-teal-seven.vercel.app/api/delete-billing/${id}`, {
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

        }

    }






    if (isLoading) {
        return (<h1 className='text-5xl text-red text-center'>Loading...</h1>)
    }

    return (
        <div className='mt-5' style={{ height: '120vh', width: '100%' }}>
            <div className="">
            </div>
            <div className="mx-auto" style={{ width: '80%' }}>


                <EditModal
                    handEditDataModal={handEditDataModal}
                    EditDataModal={EditDataModal}
                    handEditDataModalClose={handEditDataModalClose}
                    register={register}
                    errors={errors}
                    item={item}
                    handleSubmit={handleSubmit}
                    handelEdit={handelEdit}

                />


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

                    <AddDataModal handleClose={handleClose}
                        show={show}
                        handleSubmit={handleSubmit}
                        handleAddBilling={handleAddBilling}
                        errors={errors}
                        register={register} />

                </div>

                <form onSubmit={handleSubmit}>
                    <Table striped bordered hover>

                        <TableHeads />
                        <tbody>
                            {
                                items.length > 0 &&

                                items.map((item, i) => <TableBody item={item}
                                    HandelDelete={HandelDelete}
                                    handEditDataModal={handEditDataModal}
                                    items={items}
                                    i={i} key={i} />)
                            },



                        </tbody>
                    </Table>
                </form>



            </div>
            <div>

            </div>
        </div>
    );
};

export default Home;