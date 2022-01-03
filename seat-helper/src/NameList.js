import { connect } from 'react-redux';
import {
    getPeople,
    getIdsSelectForAlloc,
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
    onAllocated,
    onUnallocated,
    onCheckIn,
    onUnCheckIn,
    onAbsent,
    onUnAbsent }) => {
    const rows = people.map((person) => {
        const alloc = person.allocZone == null ? '' : `${person.allocZone}${person.allocRow}`
        return <tr>
            <td>{person.orderNum}</td>
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
