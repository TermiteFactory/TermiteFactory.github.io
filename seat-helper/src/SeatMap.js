import { connect } from 'react-redux';
import { Button, Nav, Tab, Row, Col } from 'react-bootstrap';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
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
    createUnSelectId,
    getActivatedZones,
} from './redux';

const Separator = styled.div`
    height: 30px;
    width: 2px;
    background-color: red;
    display: inline-block;
    margin-left: -1px;
    margin-right: -1px;
`

const Seat = styled.div`
    height: 30px;
    width: 30px;
    ${({ type, striped }) => {
        if (type === 'taken') {
            if (striped === 'true') {
                return 'background-image: linear-gradient(45deg, #bebdbf 10%, #808080 10%, #808080 50%, #bebdbf 50%, #bebdbf 60%, #808080 60%, #808080 100%); background-size: 7.07px 7.07px;'
            } else {
                return 'background-color: grey;'
            }

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
    position: absolute;
    left: 15vw;
    width: 70vw;
    bottom: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
`

const SeatMap = ({ people,
    zoneInfo,
    activatedZones,
    idSelectForAlloc,
    selectZone,
    selectRow,
    lastSelectZone,
    onChooseSeat,
    onDoneAlloc,
    onUnallocated, }) => {

    // Check if this is just a map showing
    const showmap = idSelectForAlloc.indexOf("showmap") !== -1;

    let drawer_content = null;
    if (idSelectForAlloc.length > 0) {
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

                        if (person.checkin === true) {
                            if (person.orderNum in result) {
                                result[person.orderNum][0]++;
                            } else {
                                result[person.orderNum] = [1, 0];
                            }
                        } else {
                            if (person.orderNum in result) {
                                result[person.orderNum][1]++;
                            } else {
                                result[person.orderNum] = [0, 1];
                            }
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
                    for (let j = 0; j < takenList[key][0]; j++) {
                        if (j === 0 && j === (takenList[key][0] - 1) && takenList[key][1] === 0) {
                            if (row.length > 1) {
                                row.push(<Separator></Separator>)
                            } 
                            row.push(<Seat type='taken' right_mark='true' left_mark='true' />)
                        } else if (j === 0) {
                            if (row.length > 1) {
                                row.push(<Separator></Separator>)
                            }
                            row.push(<Seat type='taken' left_mark='true' />)
                        } else if (j === (takenList[key][0] - 1) && takenList[key][1] === 0) {
                            row.push(<Seat type='taken' right_mark='true' />)
                        } else {
                            row.push(<Seat type='taken' />)
                        }
                        remaining--;
                    }
                    for (let j = 0; j < takenList[key][1]; j++) {
                        if (j === 0 && j === (takenList[key][1] - 1) && takenList[key][0] === 0) {
                            if (row.length > 1) {
                                row.push(<Separator></Separator>)
                            }
                            row.push(<Seat type='taken' right_mark='true' left_mark='true' striped='true' />)
                        } else if (j === 0 && takenList[key][0] === 0) {
                            if (row.length > 1) {
                                row.push(<Separator></Separator>)
                            }
                            row.push(<Seat type='taken' left_mark='true' striped='true' />)
                        } else if (j === (takenList[key][1] - 1)) {
                            row.push(<Seat type='taken' right_mark='true' striped='true' />)
                        } else {
                            row.push(<Seat type='taken' striped='true' />)
                        }
                        remaining--;
                    }
                });

                // Render Chosen
                if (rowSelected) {
                    selectionMade = true;
                    for (let j = 0; j < idSelectForAlloc.length; j++) {
                        if (j === 0 && j === (idSelectForAlloc.length - 1)) {
                            if (row.length > 1) {
                                row.push(<Separator></Separator>)
                            }
                            row.push(<Seat type='chosen' right_mark='true' left_mark='true' />)
                        } else if (j === 0) {
                            if (row.length > 1) {
                                row.push(<Separator></Separator>)
                            }
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
                <div style={{ paddingLeft: '190px' }}>
                    Zone {zone.id}
                </div>
                {rows}
            </Tab.Pane>)
        }, [])

        const firstZone = zoneInfo.find(zone => zone.id === activatedZones[0]);
        const defaultZone = lastSelectZone == null ? firstZone.id : lastSelectZone

        const confirmButton = <ConfirmButton onClick={() => onDoneAlloc()}
            variant={selectionMade ? overallocation ? "danger " : "primary" : "warning"}>
            {selectionMade ? overallocation ? 'Confirm OverAllocated Row' : 'Confirm New Selection' : 'Clear Previous Allocation'}
        </ConfirmButton>

        drawer_content = <>
            <div style={{ marginTop: 10, marginLeft: '10vw' }}>
                <IconButton sx={{ marginRight: '20px', float: 'right' }}
                    onClick={() => idSelectForAlloc.forEach((value) => onUnallocated(value))}>
                    <CloseIcon />
                </IconButton>
                <Tab.Container id="left-tabs-example" defaultActiveKey={defaultZone}>
                    <Row>
                        <Col sm={3}>
                            <Nav variant="pills" className="flex-column">
                                {tabs}
                            </Nav>
                        </Col>
                        <Col sm={8}>
                            <Tab.Content>
                                {content}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>

            </div>
            {showmap ? <div style={{ textAlign: 'center', color: 'red' }}>View-Only Seat Map</div> : confirmButton}</>
    }


    return <Drawer
        anchor='bottom' open={idSelectForAlloc.length > 0}
        variant={showmap ? "temporary" : "persistent"}
        onClose={showmap ? () => onUnallocated('showmap') : null}
        sx={{
            '& .MuiDrawer-paper': {
                height: 550,
                boxSizing: 'border-box',
                background: "#F5F5F5",
                borderColor: 'grey'
            },
        }}
    >
        {drawer_content}
    </Drawer>
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
    onUnallocated: (id, orderNum) => dispatch(createUnSelectId(id, orderNum)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SeatMap);
