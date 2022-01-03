import { Navbar, Container, Button, InputGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getPeople, getZoneInfo } from './redux';

const TopBar = ({ people, zoneInfo }) => {

    const allocstats = people.reduce((result, person) => {
        if (person.allocZone === null) {
            return {
                ...result,
                unalloc: result.unalloc + 1,
            }
        } else {
            const prev = result[person.allocZone] == null ? 0 : result[person.allocZone]
            return {
                ...result,
                [person.allocZone]: prev + 1,
            }
        }
    }, { unalloc: 0 });

    const avail = zoneInfo.reduce((result, zone) => {
        const alloc = allocstats[zone.id] == null ? 0 : allocstats[zone.id]
        return `${result}${zone.rows * zone.seats - alloc} (Zone ${zone.id}), `;
    }, '');

    return <Navbar bg="dark" variant="dark">
        <Container>
            <Navbar.Brand>Seat Helper</Navbar.Brand>
            <InputGroup>
                <FormControl
                    placeholder="Hide Name List"
                    aria-label="Hide Name List with two button addons"
                />
                <Button variant="outline-secondary">Hide Entered/Absent</Button>
            </InputGroup>
            <Navbar.Text>
                <div className="text-nowrap bd-highlight ml-3">
                    To Allocate: {allocstats.unalloc}
                </div>
                <div className="text-nowrap bd-highlight ml-3">
                    Available Space: {avail}
                </div>
            </Navbar.Text>
        </Container>
    </Navbar>
};

const mapStateToProps = state => ({
    people: getPeople(state),
    zoneInfo: getZoneInfo(state),
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBar);
