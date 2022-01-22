import { connect } from 'react-redux';
import { Navbar, Button, Nav, Tab, Row, Col } from 'react-bootstrap';
import styled from 'styled-components'
import {
    getPeople,
    getZoneInfo,
    getIdsSelectForAlloc,
    getSelectRow,
    getSelectZone,
    getLastSelectZone,
    createChooseSeat,
    createDoneAlloc,
    getActivatedZones,
} from './redux';

const Seat = styled.div`
    height: 30px;
    width: 30px;
    ${({ type }) => {
        if (type === 'taken') {
            return 'background-color: grey;'
        }
        else if (type === 'chosen') {
            return 'background-color: orange;'
        }
        else {
            return 'background-color: powderblue;'
        }
    }}
    ${({ left_mark, right_mark }) => {
        const marksize = 10;
        if (left_mark === 'true') {
            if (right_mark === 'true') {
                return `border-radius: ${marksize}px ${marksize}px ${marksize}px ${marksize}px;`
            }
            else {
                return `border-radius: ${marksize}px 0px 0px ${marksize}px;`
            }
        }
        else {
            if (right_mark === 'true') {
                return `border-radius: 0px ${marksize}px ${marksize}px 0px;`
            }
            else {
                return `border-radius: 0px 0px 0px 0px;`
            }
        }
    }}
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    display: inline-block;
`

const RowButtonContainer = styled.div`
    vertical-align: top;
    padding-top: 5px;
    width: 80px;
    display: inline-block;
`

const RowContainer = styled.div``

const ConfirmButton = styled(Button)`
    position: relative;
    margin-top: 5px;
`

const Footer = styled.div`
    position: sticky;
    bottom: 0;
    background-color: white;
    max-height: 60vh;
    overflow: scroll;
    padding: 10px;
    padding-left: 10vw;
    box-shadow: 0px 0px 30px 1px #888888;
    z-index: 2;
`

const SeatMap = ({ people,
    zoneInfo,
    activatedZones,
    idSelectForAlloc,
    selectZone,
    selectRow,
    lastSelectZone,
    onChooseSeat,
    onDoneAlloc }) => {
    if (idSelectForAlloc.length > 0) {

        // Check if this is just a map showing
        const showmap = idSelectForAlloc.indexOf("showmap") !== -1;

        // Tabs
        const tabs = zoneInfo.reduce((result, zone) => {
            if (activatedZones.indexOf(zone.id) === -1) {
                return result;
            }
            return result.concat(<Nav.Item>
                <Nav.Link eventKey={zone.id}>Zone {zone.id}</Nav.Link>
            </Nav.Item>)
        }, [])

        // Rows
        let selectionMade = false;
        let overallocation = false;
        const content = zoneInfo.reduce((result, zone) => {
            if (activatedZones.indexOf(zone.id) === -1) {
                return result;
            }
            const rows = []
            for (let i = 0; i < zone.rows; i++) {
                let takenList = people.reduce((result, person) => {
                    if (idSelectForAlloc.indexOf(person.uniqueId) === -1 &&
                        person.allocZone === zone.id &&
                        person.allocRow === i + 1) {
                        if (person.orderNum in result) {
                            result[person.orderNum]++;
                        } else {
                            result[person.orderNum] = 1;
                        }
                    }
                    return result;
                }, {});

                let rowSelected = selectZone === zone.id && (selectRow - 1) === i
                let row = [<RowButtonContainer><Button className="btn-sm"
                    variant={showmap ? "success" : rowSelected ? "success" : "outline-success"}
                    disabled={showmap}
                    onClick={() => rowSelected ? onChooseSeat(null, null) : onChooseSeat(zone.id, i + 1)}>Row {i + 1}
                </Button></RowButtonContainer>]


                // Render Taken 
                let remaining = zone.seats;
                Object.keys(takenList).forEach((key) => {
                    for (let j = 0; j < takenList[key]; j++) {
                        if (j === 0 && j === (takenList[key] - 1)) {
                            row.push(<Seat type='taken' right_mark='true' left_mark='true' />)
                        } else if (j === 0) {
                            row.push(<Seat type='taken' left_mark='true' />)
                        } else if (j === (takenList[key] - 1)) {
                            row.push(<Seat type='taken' right_mark='true' />)
                        } else {
                            row.push(<Seat type='taken' />)
                        }
                        remaining--;
                    }
                });

                // Render Chosen
                if (rowSelected) {
                    selectionMade = true;
                    for (let j = 0; j < idSelectForAlloc.length; j++) {
                        if (j === 0 && j === (idSelectForAlloc.length - 1)) {
                            row.push(<Seat type='chosen' right_mark='true' left_mark='true' />)
                        } else if (j === 0) {
                            row.push(<Seat type='chosen' left_mark='true' />)
                        } else if (j === (idSelectForAlloc.length - 1)) {
                            row.push(<Seat type='chosen' right_mark='true' />)
                        } else {
                            row.push(<Seat type='chosen' />)
                        }
                        remaining--;
                    }
                }

                if (selectionMade && remaining < 0) {
                    overallocation = true;
                }

                // Render Free
                for (let j = 0; j < remaining; j++) {
                    // Seat can be free, taken, choosen
                    row.push(<Seat type='free' />)
                }

                rows.push(<RowContainer>{row}</RowContainer>);
            }
            return result.concat(<Tab.Pane eventKey={zone.id}>
                {rows}
            </Tab.Pane>)
        }, [])

        const firstZone = zoneInfo.find(zone => zone.id === activatedZones[0]);
        const defaultZone = lastSelectZone == null ? firstZone.id : lastSelectZone

        const confirmButton = <ConfirmButton onClick={() => onDoneAlloc()}
            variant={overallocation ? "danger " : "primary"}>
            {selectionMade ? overallocation ? 'Confirm OverAllocated Row' : 'Confirm New Selection' : 'Exit and Erase Previous Allocation'}
        </ConfirmButton>

        return <Footer>
            <Tab.Container id="left-tabs-example" defaultActiveKey={defaultZone}>
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            {tabs}
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            {content}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            {showmap ? null : confirmButton}
        </Footer>
    } else {
        return <></>;
    }
};

const mapStateToProps = state => ({
    people: getPeople(state),
    zoneInfo: getZoneInfo(state),
    activatedZones: getActivatedZones(state),
    idSelectForAlloc: getIdsSelectForAlloc(state),
    selectZone: getSelectZone(state),
    selectRow: getSelectRow(state),
    lastSelectZone: getLastSelectZone(state),
});

const mapDispatchToProps = dispatch => ({
    onChooseSeat: (zone, row) => dispatch(createChooseSeat(zone, row)),
    onDoneAlloc: () => dispatch(createDoneAlloc()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SeatMap);
