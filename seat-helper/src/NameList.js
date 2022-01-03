import { connect } from 'react-redux';
import {
    getPeople,
    getIdsSelectForAlloc,
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


const NameList = ({ people,
    idsSelectForAlloc,
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
            filteredText === `${person.allocZone}${person.allocRow}`) &&
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
        const orderCell = orderSpan > 0 ? <td rowSpan={orderSpan}>{person.orderNum}</td> : null

        return <tr className={trColor}>
            {orderCell}
            <td>{person.name}</td>
            <td>{person.tixType}</td>
            <td>{person.telephone}</td>
            <td>{alloc}</td>
            <td>
                <Button variant="outline-primary" className='ml-1'>Allocate</Button>
                <Button variant="outline-secondary" className='ml-1'>Check In</Button>
                <Button variant="outline-info" className='ml-1'>Absent</Button>
            </td>
        </tr>
    });

    return <Table>
        <thead>
            <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Ticket Type</th>
                <th>Mobile</th>
                <th>Allocated Seat</th>
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
