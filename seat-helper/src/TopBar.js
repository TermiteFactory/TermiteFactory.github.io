import { Navbar, Container, Button, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import React, { useRef, useEffect } from 'react';
import {
    getPeople,
    getZoneInfo,
    createFilterText,
    createFilterOnlyUnentered,
    createUnFilterOnlyUnentered,
    getFilteredText,
    getFilterUnentered,
    getActivatedZones,
    getActiveTickets,
    getMenu,
    createMenu,
    createUnmenu,
    createNavbarHeight,
} from './redux';

const TopBar = ({ people,
    zoneInfo,
    activatedZones,
    activeTix,
    filteredText,
    filterUnenetered,
    menu,
    onFilterText,
    onFilterUnEntered,
    onUnfilterUnentered,
    onMenu,
    onUnmenu,
    onSetNavbarHeight, }) => {

    const allocstats = people.reduce((result, person) => {
        if ((activeTix.indexOf(person.tixType) !== -1 && person.tixType.indexOf("*") === -1) || person.tixType === 'On Entry') {
            if (person.allocZone === null && !person.absent) {
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
        } else {
            return result;
        }
    }, { unalloc: 0 });

    let avail = <div className="text-danger d-inline">Activate Zones!</div>
    if (activatedZones.length > 0) {
        avail = zoneInfo.reduce((result, zone) => {
            if (activatedZones.indexOf(zone.id) === -1) {
                return result;
            }
            const alloc = allocstats[zone.id] == null ? 0 : allocstats[zone.id]
            return `${result}${zone.rows * zone.seats - alloc} (${zone.id}), `;
        }, '');
    }

    // Update the bar width
    const navRef = useRef(null);
    const handleNavChangeHeight = () => {
        if (navRef != null) {
            onSetNavbarHeight(navRef.current.offsetHeight - 1);
        }
    }
    useEffect(() => {
        handleNavChangeHeight();
    }, [])
    window.addEventListener('resize', handleNavChangeHeight);

    return <Navbar ref={navRef} bg="dark" variant="dark" sticky="top">
        <Container>
            <Navbar.Brand>Seat Helper</Navbar.Brand>
            <div className="input-group">
                <FormControl
                placeholder="Filter Names"
                value={filteredText}
                onChange={e => onFilterText(e.target.value)}
                />
                <span className="input-group-append">
                    <button className="btn btn-light border-start-0 border" type="button"
                        onClick={() => onFilterText('')}>
                        &#10006;
                    </button>
                </span>
            </div>
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
            <Button
                variant={menu ? "primary" : "outline-secondary"}
                className="text-nowrap ml-3"
                onClick={() => menu ? onUnmenu() : onMenu()}>
                <strong>&#8801;</strong></Button>
        </Container>
    </Navbar>
};

const mapStateToProps = state => ({
    people: getPeople(state),
    zoneInfo: getZoneInfo(state),
    activatedZones: getActivatedZones(state),
    filteredText: getFilteredText(state),
    filterUnenetered: getFilterUnentered(state),
    activeTix: getActiveTickets(state),
    menu: getMenu(state),
});

const mapDispatchToProps = dispatch => ({
    onFilterText: (text) => dispatch(createFilterText(text)),
    onFilterUnEntered: () => dispatch(createFilterOnlyUnentered()),
    onUnfilterUnentered: () => dispatch(createUnFilterOnlyUnentered()),
    onMenu: () => dispatch(createMenu()),
    onUnmenu: () => dispatch(createUnmenu()),
    onSetNavbarHeight: (height) => dispatch(createNavbarHeight(height))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopBar);
