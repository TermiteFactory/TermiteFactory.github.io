import { connect } from 'react-redux';
import {
    getPeople,
    getIdsSelectForAlloc,
    getOrderSelectForAlloc,
    getFilteredText,
    getFilterUnentered,
    createSelectId,
    createUnSelectId,
    createCheckIn,
    createUnCheckIn,
    createAbsent,
    createUnAbsent,
    createAddPerson,
    getActiveTickets,
} from './redux';
import { Table, Button } from 'react-bootstrap';
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
    onAllocated,
    onUnallocated,
    onCheckIn,
    onUnCheckIn,
    onAbsent,
    onUnAbsent,
    onNewPerson }) => {

    // Filter
    const filtered_orders = people.reduce((result, person) => {
        if ((filteredText === '' ||
            person.name.toLowerCase().search(filteredText.toLowerCase()) !== -1 ||
            person.telephone.search(filteredText) !== -1 ||
            filteredText.toLowerCase() === `${person.allocZone}${person.allocRow}`.toLowerCase()) &&
            (!filterUnentered || (person.checkin === false && person.absent === false)) &&
            activeTix.indexOf(person.tixType) !== -1) {
            result.push(person.orderNum);
        }
        return result;
    }, []);

    const filtered_people = people.reduce((result, person) => {
        if (filtered_orders.indexOf(person.orderNum) !== -1) {
            result.push(person);
        }
        return result;
    }, []);

    // Sort by order number
    filtered_people.sort((first, second) => {
        return first.orderNum < second.orderNum;
    });

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
    const rows = filtered_people.map((person, index, array) => {

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

        let shortTix = person.tixType.substring(0, 14)

        return <tr className={trColor}>
            {orderCell}
            <td ref={el => allocateButtonRef.current[person.uniqueId] = el} >{highlightText(person.name, filteredText)}</td>
            <td><small>{shortTix}</small></td>
            <td>{highlightText(person.telephone, filteredText)}</td>
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
                        disabled={allocated || person.allocZone == null}>Check In</Button>
                    <Button variant={person.absent ? "info" : "outline-info"}
                        onClick={() => person.absent ? onUnAbsent(person.uniqueId) : onAbsent(person.uniqueId)}
                        disabled={allocated || person.checkin}
                        className='ml-1 btn-sm'>Absent</Button>
                </div>
            </td>
        </tr>
    });

    const nameInputRef = useRef(null);
    const modbileInputRef = useRef(null);
    const [nameOk, setNameOk] = useState(false);

    function handleSubmit() {
        if (nameInputRef.current.value.length > 0) {
            const person = {
                orderNum: 'ENTRY-ORDER',
                name: nameInputRef.current.value,
                tixType: 'On Entry',
                telephone: modbileInputRef.current.value,
            }
            onNewPerson(person)
            setNameOk(false);
            nameInputRef.current.value = '';
            modbileInputRef.current.value = '';
        }
    }

    rows.push(<tr>
        <td><div className="text-nowrap"><small>ENTRY-ORDER</small></div></td>
        <td><input type="text" placeholder='Fill Name'
            onChange={(e) => e.target.value !== '' ? setNameOk(true) : setNameOk(false)}
            ref={nameInputRef}></input></td>
        <td><div className="text-nowrap"><small>On Entry</small></div></td>
        <td><input type="text" placeholder='Fill Mobile' ref={modbileInputRef}></input></td>
        <td></td>
        <td><Button variant="primary"
            onClick={() => handleSubmit()}
            disabled={!nameOk}
            className='ml-1 btn-sm'>Add Person</Button></td>
    </tr>)

    return <Table>
        <thead>
            <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Ticket</th>
                <th>Mobile</th>
                <th>Seat</th>
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
