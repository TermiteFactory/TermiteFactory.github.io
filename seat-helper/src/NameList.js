import { connect } from 'react-redux';
import {
    getPeople,
    getIdsSelectForAlloc,
    getOrderSelectForAlloc,
    getFilteredText,
    getFilterUnentered,
    getNavbarHeight,
    createSelectId,
    createUnSelectId,
    createCheckIn,
    createUnCheckIn,
    createAbsent,
    createUnAbsent,
    createAddPerson,
    getActiveTickets,
} from './redux';
import { Table, Button, FormControl } from 'react-bootstrap';
import React, { useRef, useEffect, useState } from 'react'

function highlightText(text, searchstr) {
    if (searchstr == null || searchstr === '') {
        return text;
    }
    const idx = text.toLowerCase().indexOf(searchstr.toLowerCase())
    if (idx === -1) {
        return text;
    } else {
        return <p>{text.substring(0, idx)}
            <mark><strong>{text.substring(idx, idx + searchstr.length)}</strong></mark>
            {text.substring(idx + searchstr.length)}</p>;
    }
}

const NameList = ({ people,
    idsSelectForAlloc,
    orderSelectForAlloc,
    filteredText,
    filterUnentered,
    activeTix,
    navbarHeight,
    onAllocated,
    onUnallocated,
    onCheckIn,
    onUnCheckIn,
    onAbsent,
    onUnAbsent,
    onNewPerson }) => {

    // Sort by ticket, order number and unique id
    people.sort((first, second) => {
        if (first.tixType < second.tixType) {
            return -1;
        } else if (first.tixType === second.tixType) {
            if (first.orderNum < second.orderNum) {
                return -1;
            } else if (first.orderNum === second.orderNum) {
                if (first.uniqueId < second.uniqueId) {
                    return -1;
                } else if (first.uniqueId === second.uniqueId) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    });

    // Extract Filtered Order Numbers
    const filtered_orders = people.reduce((result, person) => {
        if ((filteredText === '' ||
            person.name.toLowerCase().search(filteredText.toLowerCase()) !== -1 ||
            person.telephone.search(filteredText) !== -1 ||
            filteredText.toLowerCase() === `${person.allocZone}${person.allocRow}`.toLowerCase()) &&
            (!filterUnentered || (person.checkin === false && person.absent === false)) &&
            (activeTix.indexOf(person.tixType) !== -1 || person.tixType === 'On Entry')) {
            result.push(person.orderNum);
        }
        return result;
    }, []);

    let serial_num = 0;
    const sn_people = people.map((person, index, array) => {
        // Add a Ticket header
        if (index === 0 || array[index - 1].tixType !== array[index].tixType) {
            serial_num = 1;
        } else {
            serial_num++;
        }
        return {
            sn: serial_num,
            ...person
        }
    });

    // Filter the orders
    const filtered_people = sn_people.reduce((result, person) => {
        if (filtered_orders.indexOf(person.orderNum) !== -1) {
            result.push(person);
        }
        return result;
    }, []);


    // Reference ref
    const allocateButtonRef = useRef({})
    useEffect(() => {
        if (idsSelectForAlloc.length > 0) {
            const yOffset = -200; // Off set the nav bar
            const y = allocateButtonRef.current[idsSelectForAlloc[0]].getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [idsSelectForAlloc]);

    let stripe = false;
    const rows = filtered_people.reduce((result, person, index, array) => {

        const alloc = person.allocZone == null ? '' : `${person.allocZone}${person.allocRow}`

        // Invert the stripe
        let orderSpan = 0;
        if (index === 0 || array[index - 1].orderNum !== person.orderNum) {
            let idx = index;
            // Find the span
            while (array.length > idx && array[idx].orderNum === person.orderNum) {
                orderSpan++;
                idx++;
            }
            stripe = !stripe;
        }
        const trColor = stripe ? "table-active" : "table-light";
        const orderCell = orderSpan > 0 ? <td rowSpan={orderSpan}><div className="text-nowrap"><small>{person.orderNum}</small></div></td> : null;
        const allocated = idsSelectForAlloc.indexOf(person.uniqueId) !== -1;

        // Add a Ticket header
        if (index === 0 || array[index - 1].tixType !== array[index].tixType) {
            result.push(<td colSpan="6"
                className="table-dark bg-primary text-center">
                <strong>{array[index].tixType}</strong>
            </td>)
        }

        return result.concat(<tr className={trColor}>
            <td><small>{person.sn}</small></td>
            {orderCell}
            <td ref={el => allocateButtonRef.current[person.uniqueId] = el} >{highlightText(person.name, filteredText)}</td>
            <td><small>{highlightText(person.telephone, filteredText)}</small></td>
            <td>{highlightText(alloc, filteredText)}</td>
            <td>
                <div className="text-nowrap">
                    <Button variant={allocated ? "success" : "outline-success"}
                        onClick={() => allocated ? onUnallocated(person.uniqueId) : onAllocated(person.uniqueId, person.orderNum)}
                        disabled={(orderSelectForAlloc != null && orderSelectForAlloc !== person.orderNum) || person.absent || person.checkin}
                        className='ml-1 btn-sm'>Allocate</Button>
                    <Button variant={person.checkin ? "secondary" : "outline-secondary"}
                        className='ml-1 btn-sm'
                        onClick={() => person.checkin ? onUnCheckIn(person.uniqueId) : onCheckIn(person.uniqueId)}
                        disabled={allocated || person.allocZone == null}>Enter</Button>
                    <Button variant={person.absent ? "info" : "outline-info"}
                        onClick={() => person.absent ? onUnAbsent(person.uniqueId) : onAbsent(person.uniqueId)}
                        disabled={allocated || person.checkin}
                        className='ml-1 btn-sm'>Absent</Button>
                </div>
            </td>
        </tr>)
    }, []);

    const nameInputRef = useRef(null);
    const modbileInputRef = useRef(null);
    const [nameOk, setNameOk] = useState(false);

    function handleSubmit() {
        if (nameInputRef.current.value.length > 0) {
            const person = {
                orderNum: 'ENTRY-ORDER',
                name: nameInputRef.current.value,
                telephone: modbileInputRef.current.value,
                tixType: 'On Entry',
            }
            onNewPerson(person)
            setNameOk(false);
            nameInputRef.current.value = '';
            modbileInputRef.current.value = '';
        }
    }

    // Add New Entries
    rows.push(<tr>
        <td><div className="text-nowrap"><small></small></div></td>
        <td><div className="text-nowrap"><small>ENTRY-ORDER</small></div></td>
        <td><FormControl type="text" placeholder='Name' className='col-sm-14'
            onChange={(e) => e.target.value !== '' ? setNameOk(true) : setNameOk(false)}
            ref={nameInputRef}></FormControl></td>
        <td><FormControl type="text" placeholder='Mobile'
            className='col-sm-14 form-control-sm'
            ref={modbileInputRef}></FormControl></td>
        <td></td>
        <td><Button variant="primary"
            onClick={() => handleSubmit()}
            disabled={!nameOk}
            className='ml-1 btn-sm text-nowrap'>Add Person</Button></td>
    </tr>)

    return <Table>
        <thead>
            <tr>
                <th>Sn</th>
                <th>Order</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Loc</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </Table>;
}

const mapStateToProps = state => ({
    people: getPeople(state),
    idsSelectForAlloc: getIdsSelectForAlloc(state),
    orderSelectForAlloc: getOrderSelectForAlloc(state),
    filteredText: getFilteredText(state),
    filterUnentered: getFilterUnentered(state),
    activeTix: getActiveTickets(state),
    navbarHeight: getNavbarHeight(state)
});

const mapDispatchToProps = dispatch => ({
    onAllocated: (id, orderNum) => dispatch(createSelectId(id, orderNum)),
    onUnallocated: (id, orderNum) => dispatch(createUnSelectId(id, orderNum)),
    onCheckIn: (id) => dispatch(createCheckIn(id)),
    onUnCheckIn: (id) => dispatch(createUnCheckIn(id)),
    onAbsent: (id) => dispatch(createAbsent(id)),
    onUnAbsent: (id) => dispatch(createUnAbsent(id)),
    onNewPerson: (person) => dispatch(createAddPerson(person)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NameList);
