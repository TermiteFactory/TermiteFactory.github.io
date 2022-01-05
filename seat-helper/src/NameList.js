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
    createUnAbsent
} from './redux';
import { Table, Button } from 'react-bootstrap';

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
    onAllocated,
    onUnallocated,
    onCheckIn,
    onUnCheckIn,
    onAbsent,
    onUnAbsent }) => {

    // Filter
    const filtered_orders = people.reduce((result, person) => {
        if ((filteredText === '' ||
            person.name.toLowerCase().search(filteredText.toLowerCase()) !== -1 ||
            person.telephone.search(filteredText) !== -1 ||
            filteredText.toLowerCase() === `${person.allocZone}${person.allocRow}`.toLowerCase()) &&
            (!filterUnentered || (person.checkin === false && person.absent === false))) {
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
        const orderCell = orderSpan > 0 ? <td rowSpan={orderSpan}>{person.orderNum}</td> : null;
        const allocated = idsSelectForAlloc.indexOf(person.uniqueId) !== -1;

        const regex = /([0-9]\/[0-9])[- ]*\((.+)\//g;
        const found = person.tixType.matchAll(regex);
        let shortTix = ''
        Array.from(found, x => shortTix += `${x[1]} (${x[2]})`)

        return <tr className={trColor}>
            {orderCell}
            <td>{highlightText(person.name, filteredText)}</td>
            <td>{shortTix}</td>
            <td>{highlightText(person.telephone, filteredText)}</td>
            <td>{highlightText(alloc, filteredText)}</td>
            <td>
                <Button variant={allocated ? "success" : "outline-success"}
                    onClick={() => allocated ? onUnallocated(person.uniqueId) : onAllocated(person.uniqueId, person.orderNum)}
                    disabled={(orderSelectForAlloc != null && orderSelectForAlloc !== person.orderNum) || person.absent || person.checkin}
                    className='ml-1'>Allocate</Button>
                <Button variant={person.checkin ? "secondary" : "outline-secondary"}
                    className='ml-1'
                    onClick={() => person.checkin ? onUnCheckIn(person.uniqueId) : onCheckIn(person.uniqueId)}
                    disabled={allocated || person.allocZone == null}>Check In</Button>
                <Button variant={person.absent ? "info" : "outline-info"}
                    onClick={() => person.absent ? onUnAbsent(person.uniqueId) : onAbsent(person.uniqueId)}
                    disabled={allocated || person.checkin}
                    className='ml-1'>Absent</Button>
            </td>
        </tr>
    });

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
});

const mapDispatchToProps = dispatch => ({
    onAllocated: (id, orderNum) => dispatch(createSelectId(id, orderNum)),
    onUnallocated: (id, orderNum) => dispatch(createUnSelectId(id, orderNum)),
    onCheckIn: (id) => dispatch(createCheckIn(id)),
    onUnCheckIn: (id) => dispatch(createUnCheckIn(id)),
    onAbsent: (id) => dispatch(createAbsent(id)),
    onUnAbsent: (id) => dispatch(createUnAbsent(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NameList);
