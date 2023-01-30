import React from 'react';
import { Button } from 'react-bootstrap';


const TableBody = ({ item, i, HandelDelete, handEditDataModal }) => {



    const {
        _id,
        myuuid,
        name,
        email,
        phone,
        amount
    } = item;

    return (
        <tr>
            <td>{myuuid} </td>
            <td>{name} </td>
            <td>{email} </td>
            <td>{phone} </td>
            <td>{amount} </td>
            {/* <td>{discount} </td>
            <td>{discountAmt} </td>
            <td>{finalBasicCost} </td>
            <td>{texes} </td>
            <td>{taxesAmt} </td>
            <td>{totalCost} </td> */}
            <td>
                <Button variant="danger" className='me-3' onClick={() => HandelDelete(_id)} >Delete</Button>
                {/* <Button variant="danger" className='me-3' onClick={() => HandelEdit(_id)} >Edit</Button> */}
                <Button variant="primary" onClick={() => handEditDataModal(item)}>
                    Editt
                </Button>
            </td>
        </tr>
    );
};

export default TableBody;