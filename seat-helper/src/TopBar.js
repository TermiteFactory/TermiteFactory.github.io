import { Navbar, Container, Button, InputGroup, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
    getPeople,
    getZoneInfo,
    createFilterText,
    createFilterOnlyUnentered,
    createUnFilterOnlyUnentered,
    getFilteredText,
    getFilterUnentered
} from './redux';

const TopBar = ({ people,
    zoneInfo,
    filteredText,
    filterUnenetered,
    onFilterText,
    onFilterUnEntered,
    onUnfilterUnentered }) => {

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

    return <Navbar bg="dark" variant="dark" sticky="top">
        <Container>
            <Navbar.Brand>Seat Helper</Navbar.Brand>
                <FormControl
                placeholder="Filter Names"
                value={filteredText}
                onChange={e => onFilterText(e.target.value)}
                />
            <Button
                className="text-nowrap ml-3"
                variant={filterUnenetered ? "primary" : "outline-secondary"}
                onClick={() => filterUnenetered ? onUnfilterUnentered() : onFilterUnEntered()}>
                {filterUnenetered ? 'Show Done' : 'Hide Done'}
            </Button>
            <Navbar.Text>
                <div className="text-nowrap bd-highlight ml-3">
                    To Allocate: {allocstats.unalloc}
                </div>
                <div className="text-nowrap bd-highlight ml-3">
                    Space: {avail}
                </div>
            </Navbar.Text>
        </Container>
    </Navbar>
};

const mapStateToProps = state => ({
    people: getPeople(state),
    zoneInfo: getZoneInfo(state),
    filteredText: getFilteredText(state),
    filterUnenetered: getFilterUnentered(state),
});

const mapDispatchToProps = dispatch => ({
    onFilterText: (text) => dispatch(createFilterText(text)),
    onFilterUnEntered: () => dispatch(createFilterOnlyUnentered()),
    onUnfilterUnentered: () => dispatch(createUnFilterOnlyUnentered()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBar);
